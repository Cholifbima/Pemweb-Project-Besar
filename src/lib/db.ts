import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Build DATABASE_URL from environment variables or use Azure connection string
function getDatabaseUrl(): string {
  // Log environment untuk debugging (hanya di server)
  if (typeof window === 'undefined') {
    console.log('🔍 Database Environment Check:', {
      NODE_ENV: process.env.NODE_ENV,
      hasDATA_URL: !!process.env.DATABASE_URL,
      hasAzureServer: !!process.env.AZURE_SQL_SERVER,
      hasAzureUsername: !!process.env.AZURE_SQL_USERNAME,
      hasAzurePassword: !!process.env.AZURE_SQL_PASSWORD,
      hasAzureDatabase: !!process.env.AZURE_SQL_DATABASE,
    });
  }

  // Priority 1: Direct DATABASE_URL (most reliable for Azure App Service)
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('file:')) {
    console.log('✅ Using DATABASE_URL from Azure App Service');
    return process.env.DATABASE_URL;
  }

  // Priority 2: Hardcoded Azure SQL connection for production (TEMPORARY FIX)
  if (process.env.NODE_ENV === 'production') {
    console.log('🔧 Using hardcoded Azure SQL connection for production');
    // Use the actual connection string with correct credentials
    const azureConnectionString = 'sqlserver://doaibustore-sv.database.windows.net:1433;database=doaibustore-db;user=doaibustore-sv-admin;password=ganteng#123;encrypt=true;trustServerCertificate=false;connectionTimeout=30;';
    return azureConnectionString;
  }

  // Priority 3: Build from individual Azure SQL variables (fallback)
  if (process.env.AZURE_SQL_SERVER && process.env.AZURE_SQL_USERNAME && process.env.AZURE_SQL_PASSWORD && process.env.AZURE_SQL_DATABASE) {
    const server = process.env.AZURE_SQL_SERVER;
    const username = process.env.AZURE_SQL_USERNAME;
    const password = process.env.AZURE_SQL_PASSWORD;
    const database = process.env.AZURE_SQL_DATABASE;
    const port = process.env.AZURE_SQL_PORT || '1433';
    
    console.log('🔧 Building Azure SQL connection from environment variables');
    console.log('- Server:', server);
    console.log('- Database:', database);
    console.log('- Username:', username);
    console.log('- Port:', port);
    
    // Use the correct format for Azure SQL Database with Prisma
    const connectionString = `sqlserver://${server}:${port};database=${database};user=${username};password=${password};encrypt=true;trustServerCertificate=false;connectionTimeout=30;`;
    
    console.log('🔗 Azure SQL Connection String (masked):', connectionString.replace(password, '***'));
    return connectionString;
  }
  
  // Priority 4: Local development dengan SQLite
  if (process.env.NODE_ENV === 'development') {
    console.log('🔧 Using development SQLite database');
    return "file:./dev.db";
  }
  
  // Priority 5: Build-time fallback
  console.log('⚠️ Using build-time fallback');
  return "file:./fallback.db";
}

function createPrismaClient() {
  const databaseUrl = getDatabaseUrl();
  
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: databaseUrl
      }
    },
    errorFormat: 'pretty',
  })
}

let prismaInstance: PrismaClient | undefined

// Hanya initialize Prisma di runtime, bukan saat build
if (typeof window === 'undefined') {
  try {
    if (process.env.NODE_ENV === 'production') {
      prismaInstance = createPrismaClient()
      console.log('✅ Prisma client initialized for production');
    } else {
      if (!globalForPrisma.prisma) {
        globalForPrisma.prisma = createPrismaClient()
        console.log('🔧 Prisma client initialized for development');
      }
      prismaInstance = globalForPrisma.prisma
    }
  } catch (error) {
    console.error('❌ Failed to initialize Prisma client:', error);
    // Jangan throw error saat build, hanya log
    if (process.env.NODE_ENV !== 'production') {
      throw error;
    }
  }
}

export const prisma = prismaInstance as PrismaClient 

// Database connection helper with environment detection
export async function connectToDatabase() {
  try {
    // Test the connection
    await prisma.$connect()
    console.log('✅ Database connected successfully')
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    return false
  }
}

// Helper function to safely create user with balance field
export async function createUserSafely(userData: {
  email: string
  username: string
  password: string
  fullName?: string
  phoneNumber?: string
}) {
  try {
    // First, try to create user with basic fields only
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        username: userData.username,
        password: userData.password,
        fullName: userData.fullName || null,
        phoneNumber: userData.phoneNumber || null,
      },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        phoneNumber: true,
        createdAt: true,
      },
    })
    
    // Try to add balance using raw SQL
    try {
      await prisma.$executeRaw`
        UPDATE users 
        SET balance = 1000000 
        WHERE id = ${user.id}
      `
      console.log('✅ Balance added successfully via raw SQL')
    } catch (sqlError) {
      console.log('⚠️ Could not add balance via SQL, field may not exist yet')
    }
    
    // Return user with balance
    return {
      ...user,
      balance: 1000000,
    }
    
  } catch (error: any) {
    console.error('❌ Error creating user:', error)
    throw error
  }
} 