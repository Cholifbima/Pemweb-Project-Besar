import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Azure SQL Database Configuration - PRODUCTION ONLY
function getDatabaseUrl(): string {
  console.log('🔗 Configuring Azure SQL Database connection...')
  
  // ALWAYS use Azure SQL Database for production deployment
  const azureConnectionString = 'sqlserver://doaibustore-sv.database.windows.net:1433;database=doaibustore-db;user=doaibustore-sv-admin;password=ganteng#123;encrypt=true;trustServerCertificate=false;connectionTimeout=30;'
  
  console.log('✅ Using Azure SQL Database:', {
    server: 'doaibustore-sv.database.windows.net',
    database: 'doaibustore-db',
    username: 'doaibustore-sv-admin'
  })
  
  return azureConnectionString
}

function createPrismaClient() {
  const databaseUrl = getDatabaseUrl()
  
  return new PrismaClient({
    log: ['error', 'warn'],
    datasources: {
      db: {
        url: databaseUrl
      }
    },
    errorFormat: 'pretty',
  })
}

let prismaInstance: PrismaClient | undefined

// Initialize Prisma client for Azure SQL Database
if (typeof window === 'undefined') {
  try {
    prismaInstance = createPrismaClient()
    console.log('✅ Prisma client initialized for Azure SQL Database')
  } catch (error) {
    console.error('❌ Failed to initialize Prisma client:', error)
    // Don't throw error during build
  }
}

export const prisma = prismaInstance as PrismaClient 

// Database connection helper
export async function connectToDatabase() {
  try {
    await prisma.$connect()
    console.log('✅ Connected to Azure SQL Database successfully')
    return true
  } catch (error) {
    console.error('❌ Azure SQL Database connection failed:', error)
    return false
  }
}

// Helper function to safely create user
export async function createUserSafely(userData: {
  email: string
  username: string
  password: string
  fullName?: string
  phoneNumber?: string
}) {
  try {
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        username: userData.username,
        password: userData.password,
        fullName: userData.fullName || null,
        phoneNumber: userData.phoneNumber || null,
        balance: 1000000, // Default balance
      },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        phoneNumber: true,
        balance: true,
        createdAt: true,
      },
    })
    
    console.log('✅ User created successfully in Azure SQL Database')
    return user
    
  } catch (error: any) {
    console.error('❌ Error creating user in Azure SQL Database:', error)
    throw error
  }
} 