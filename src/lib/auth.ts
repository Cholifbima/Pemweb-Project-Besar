import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from './db';

// JWT Secret - in production this should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface UserPayload {
  id: number;
  email: string;
  username: string;
}

export interface LoginResult {
  success: boolean;
  token?: string;
  user?: any;
  error?: string;
}

export interface RegisterResult {
  success: boolean;
  user?: any;
  error?: string;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Generate JWT token
export function generateToken(user: UserPayload): string {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      username: user.username 
    },
    JWT_SECRET,
    { expiresIn: '7d' } // Token expires in 7 days
  );
}

// Verify JWT token
export function verifyToken(token: string): UserPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

// Register user
export async function registerUser(userData: {
  email: string;
  username: string;
  password: string;
  fullName?: string;
  phoneNumber?: string;
}): Promise<RegisterResult> {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: userData.email },
          { username: userData.username }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.email === userData.email) {
        throw new Error('Email sudah terdaftar');
      }
      if (existingUser.username === userData.username) {
        throw new Error('Username sudah digunakan');
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(userData.password);

    // Create user with 1 million balance for demo
    const user = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        balance: 1000000, // 1 juta rupiah untuk demo
      },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        phoneNumber: true,
        balance: true,
        createdAt: true,
      }
    });

    return { success: true, user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Login user
export async function loginUser(emailOrUsername: string, password: string): Promise<LoginResult> {
  try {
    // Find user by email or username
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: emailOrUsername },
          { username: emailOrUsername }
        ]
      }
    });

    if (!user) {
      throw new Error('User tidak ditemukan');
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      throw new Error('Password salah');
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
    });

    return {
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        balance: user.balance,
      }
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Get user by token
export async function getUserFromToken(token: string) {
  try {
    const payload = verifyToken(token);
    if (!payload) {
      throw new Error('Token tidak valid');
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        phoneNumber: true,
        favoriteGames: true,
        totalSpent: true,
        balance: true,
        createdAt: true,
      }
    });

    if (!user) {
      throw new Error('User tidak ditemukan');
    }

    return { success: true, user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Middleware to protect routes
export function requireAuth(handler: any) {
  return async (req: any, res: any) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ error: 'Token tidak ditemukan' });
      }

      const userResult = await getUserFromToken(token);
      if (!userResult.success) {
        return res.status(401).json({ error: userResult.error });
      }

      req.user = userResult.user;
      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  };
} 