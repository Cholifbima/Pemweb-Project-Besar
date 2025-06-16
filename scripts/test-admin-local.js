const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

// Use SQLite for local testing
process.env.DATABASE_URL = 'file:./dev.db'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Testing admin seeding logic (SQLite)...')

  try {
    // Test database connection
    await prisma.$connect()
    console.log('✅ Connected to database successfully')

    // Admin accounts to test
    const adminAccounts = [
      { 
        username: 'Cholif', 
        password: 'Cholif123', 
        hashedPassword: '$2b$10$kFKTdsUqU5MxXojfB5/nneBTe0LelksRENqqU8Bd1PgRZQ028L/0.',
        role: 'super_admin' 
      },
    ]

    for (const admin of adminAccounts) {
      try {
        // Check if admin already exists
        const existingAdmin = await prisma.admin.findUnique({
          where: { username: admin.username }
        })

        if (existingAdmin) {
          console.log(`✅ Admin ${admin.username} already exists (ID: ${existingAdmin.id})`)
          continue
        }

        // Create new admin
        const newAdmin = await prisma.admin.create({
          data: {
            username: admin.username,
            password: admin.hashedPassword,
            role: admin.role,
            isActive: true,
            isOnline: false,
          }
        })

        console.log(`✨ Created admin: ${admin.username} (${admin.role}) - ID: ${newAdmin.id}`)
      } catch (adminError) {
        console.error(`❌ Error processing admin ${admin.username}:`, adminError.message)
      }
    }

    // Test login with bcrypt
    const testAdmin = await prisma.admin.findUnique({
      where: { username: 'Cholif' }
    })

    if (testAdmin) {
      const isValidPassword = await bcrypt.compare('Cholif123', testAdmin.password)
      console.log(`🔐 Password test for Cholif: ${isValidPassword ? '✅ Valid' : '❌ Invalid'}`)
    }

    console.log('\n🎉 Local admin seeding test completed!')

  } catch (error) {
    console.error('❌ Error during admin seeding test:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error('💥 Failed to test admin seeding:', e)
    process.exit(1)
  }) 