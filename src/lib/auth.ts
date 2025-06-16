import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma, createUserSafely } from './db';
import { NextRequest } from 'next/server';

// JWT Secret - in production this should be in environment variables
export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

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

    // Create user safely with balance field handling
    const user = await createUserSafely({
      ...userData,
      password: hashedPassword,
    });

    return { success: true, user };
  } catch (error: any) {
    console.error('Register user error:', error);
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
        // Note: balance will be fetched separately using raw SQL when needed
      }
    };
  } catch (error: any) {
    console.error('Login user error:', error);
    return { success: false, error: error.message };
  }
}

// Get user by token (for chat APIs)
export async function getUserFromToken(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('No authorization header');
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    if (!payload) {
      throw new Error('Invalid token');
    }

    // Get user from database
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
      throw new Error('User not found');
    }

    return user;
  } catch (error: any) {
    console.error('getUserFromToken error:', error);
    return null;
  }
}

// Get user by token (legacy function for compatibility)
export async function getUserFromTokenLegacy(token: string) {
  try {
    const payload = verifyToken(token);
    if (!payload) {
      throw new Error('Token tidak valid');
    }

    // Try to get user with all fields first
    try {
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
      // If balance field doesn't exist, try without it
      if (error.message?.includes('balance') || error.message?.includes('Unknown argument')) {
        console.log('⚠️ Balance field not found, fetching user without balance...');
        
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
            createdAt: true,
          }
        });

        if (!user) {
          throw new Error('User tidak ditemukan');
        }

        // Get balance from raw SQL
        const balanceResult = await prisma.$queryRaw<{balance: number}[]>`
          SELECT balance FROM users WHERE id = ${payload.id}
        `;

        const balance = balanceResult[0]?.balance || 0;

        return { 
          success: true, 
          user: { 
            ...user, 
            balance 
          } 
        };
      }
      throw error;
    }
  } catch (error: any) {
    console.error('Get user from token error:', error);
    return { success: false, error: error.message };
  }
}

// Verify user token and get user data
export function verifyUserToken(token: string): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const payload = verifyToken(token);
      if (!payload) {
        reject(new Error('Token tidak valid'));
        return;
      }

      const user = await prisma.user.findUnique({
        where: { id: payload.id }
      });

      if (!user) {
        reject(new Error('User tidak ditemukan'));
        return;
      }

      resolve(user);
    } catch (error) {
      reject(error);
    }
  });
}

// Middleware to require authentication
export function requireAuth(handler: any) {
  return async (req: any, res: any) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const token = authHeader.substring(7);
      const user = await verifyUserToken(token);
      
      req.user = user;
      return handler(req, res);
    } catch (error: any) {
      return res.status(401).json({ error: error.message });
    }
  };
} 