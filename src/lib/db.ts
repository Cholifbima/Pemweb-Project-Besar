import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Default DATABASE_URL for build time (will be overridden at runtime)
const DEFAULT_DATABASE_URL = "sqlserver://localhost:1433;database=temp;user=temp;password=temp;encrypt=true;"

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL || DEFAULT_DATABASE_URL
      }
    }
  })
}

let prismaInstance: PrismaClient | undefined

// Only initialize Prisma in runtime, not during build
if (typeof window === 'undefined') {
  if (process.env.NODE_ENV === 'production') {
    prismaInstance = createPrismaClient()
  } else {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = createPrismaClient()
    }
    prismaInstance = globalForPrisma.prisma
  }
}

export const prisma = prismaInstance as PrismaClient 