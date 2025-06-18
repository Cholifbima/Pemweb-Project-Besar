import { PrismaClient } from '../../generated/client-dev'

const globalForPrisma = globalThis as unknown as {
  prismaDev: PrismaClient | undefined
}

export const prismaDev =
  globalForPrisma.prismaDev ??
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaDev = prismaDev 