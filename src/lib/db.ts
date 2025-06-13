import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Build DATABASE_URL from environment variables
function getDatabaseUrl(): string {
  // For production, use the direct DATABASE_URL if available
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  
  // For Azure deployment, build from individual variables
  if (process.env.AZURE_SQL_SERVER && process.env.AZURE_SQL_USERNAME && process.env.AZURE_SQL_PASSWORD && process.env.AZURE_SQL_DATABASE) {
    const server = process.env.AZURE_SQL_SERVER;
    const username = process.env.AZURE_SQL_USERNAME;
    const password = process.env.AZURE_SQL_PASSWORD;
    const database = process.env.AZURE_SQL_DATABASE;
    const port = process.env.AZURE_SQL_PORT || '1433';
    
    // Format username for Azure SQL Database (username@server)
    const serverName = server.split('.')[0]; // Extract server name from FQDN
    const azureUsername = `${username}@${serverName}`;
    
    return `sqlserver://${server}:${port};database=${database};user=${azureUsername};password=${password};encrypt=true;trustServerCertificate=false;connectionTimeout=30;`;
  }
  
  // Development fallback - use SQLite for local development
  if (process.env.NODE_ENV === 'development') {
    return "file:./dev.db";
  }
  
  // Build time fallback
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

// Only initialize Prisma in runtime, not during build
if (typeof window === 'undefined') {
  if (process.env.NODE_ENV === 'production') {
    try {
      prismaInstance = createPrismaClient()
    } catch (error) {
      console.error('Failed to initialize Prisma client:', error)
      // Don't throw error during build, just log it
    }
  } else {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = createPrismaClient()
    }
    prismaInstance = globalForPrisma.prisma
  }
}

export const prisma = prismaInstance as PrismaClient 