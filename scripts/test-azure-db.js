const { PrismaClient } = require('@prisma/client')

// Set connection string manually for testing - Fixed URL encoding
const DATABASE_URL = "sqlserver://doaibustore-sv.database.windows.net:1433;database=doaibustore-db;user=doaibustore-sv-admin;password=ganteng#123;encrypt=true;trustServerCertificate=false;connectionTimeout=30"

console.log('🔍 Testing Azure SQL Database connection...')
console.log('Server: doaibustore-sv.database.windows.net')

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL
    }
  }
})

async function testConnection() {
  try {
    console.log('📡 Connecting to database...')
    
    // Test connection
    await prisma.$connect()
    console.log('✅ Connected successfully!')
    
    // Test simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ Query test passed:', result)
    
    // Test schema information
    const tables = await prisma.$queryRaw`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_TYPE = 'BASE TABLE'
    `
    console.log('📋 Existing tables:', tables)
    
    console.log('🎉 Database connection test successful!')
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message)
    console.error('Full error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Usage instructions
console.log('📝 Before running this test:')
console.log('1. Replace [USERNAME] with your database admin username')
console.log('2. Replace [PASSWORD] with your database admin password') 
console.log('3. Replace [DATABASE_NAME] with your exact database name')
console.log('4. Run: node scripts/test-azure-db.js')
console.log('')

// Only run if connection string is not template
if (!DATABASE_URL.includes('[USERNAME]')) {
  testConnection()
} else {
  console.log('⚠️  Please update the DATABASE_URL with real credentials first!')
} 