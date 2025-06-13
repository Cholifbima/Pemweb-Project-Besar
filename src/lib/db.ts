import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Build DATABASE_URL from environment variables
function getDatabaseUrl(): string {
  // Log environment untuk debugging
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

  // Priority 1: Production dengan DATABASE_URL langsung
  if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
    console.log('✅ Using production DATABASE_URL');
    return process.env.DATABASE_URL;
  }
  
  // Priority 2: Local development dengan SQLite
  if (process.env.NODE_ENV === 'development') {
    console.log('🔧 Using development SQLite database');
    return "file:./dev.db";
  }
  
  // Priority 3: Azure deployment dengan individual variables
  if (process.env.AZURE_SQL_SERVER && process.env.AZURE_SQL_USERNAME && process.env.AZURE_SQL_PASSWORD && process.env.AZURE_SQL_DATABASE) {
    const server = process.env.AZURE_SQL_SERVER;
    const username = process.env.AZURE_SQL_USERNAME;
    const password = process.env.AZURE_SQL_PASSWORD;
    const database = process.env.AZURE_SQL_DATABASE;
    const port = process.env.AZURE_SQL_PORT || '1433';
    
    // Format username untuk Azure SQL Database
    const serverName = server.includes('.') ? server.split('.')[0] : server;
    const azureUsername = username.includes('@') ? username : `${username}@${serverName}`;
    
    const connectionString = `sqlserver://${server}:${port};database=${database};user=${azureUsername};password=${password};encrypt=true;trustServerCertificate=false;connectionTimeout=30;`;
    
    console.log('🔗 Using Azure SQL connection (built from env vars)');
    console.log('Server:', server);
    console.log('Database:', database);
    console.log('Username:', azureUsername);
    
    return connectionString;
  }
  
  // Priority 4: Fallback ke DATABASE_URL jika ada
  if (process.env.DATABASE_URL) {
    console.log('🔄 Using fallback DATABASE_URL');
    return process.env.DATABASE_URL;
  }
  
  // Priority 5: Build-time fallback (tidak akan digunakan di runtime)
  console.log('⚠️ Using build-time fallback - this should not happen in production');
  return "sqlserver://localhost:1433;database=temp;user=temp;password=temp;encrypt=true;";
}

function createPrismaClient() {
  const databaseUrl = getDatabaseUrl();
  
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: databaseUrl
      }
    }
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