const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding admin accounts to Azure SQL Database...')
  
  // Check current environment
  console.log('Database URL:', process.env.DATABASE_URL ? 'Configured' : 'Not configured')
  console.log('Node ENV:', process.env.NODE_ENV)

  try {
    // Test database connection
    await prisma.$connect()
    console.log('✅ Connected to database successfully')

    // Admin accounts to create with bcrypt hashed passwords
    const adminAccounts = [
      { 
        username: 'Cholif', 
        password: 'Cholif123', 
        hashedPassword: '$2b$10$kFKTdsUqU5MxXojfB5/nneBTe0LelksRENqqU8Bd1PgRZQ028L/0.',
        role: 'super_admin' 
      },
      { 
        username: 'Havizhan', 
        password: 'Havizhan123', 
        hashedPassword: '$2b$10$ju.NvFMNCvwavMDFDmJawuLXC53bg9XnQxz99FrMiYpho51HaRfZG',
        role: 'admin' 
      },
      { 
        username: 'Fathan', 
        password: 'Fathan123', 
        hashedPassword: '$2b$10$sArOqZ.ra9V6ZLHlkQSiMOZ9ciO5Tih42zStrb2uCm5mL3cc7vCha',
        role: 'admin' 
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
          
          // Update password if needed (for consistency)
          await prisma.admin.update({
            where: { username: admin.username },
            data: {
              password: admin.hashedPassword,
              role: admin.role,
              isActive: true,
              updatedAt: new Date()
            }
          })
          console.log(`🔄 Updated admin ${admin.username}`)
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
            createdAt: new Date(),
            updatedAt: new Date()
          }
        })

        console.log(`✨ Created admin: ${admin.username} (${admin.role}) - ID: ${newAdmin.id}`)
        console.log(`   Password: ${admin.password}`)
      } catch (adminError) {
        console.error(`❌ Error processing admin ${admin.username}:`, adminError.message)
      }
    }

    // Verify all admins exist
    const allAdmins = await prisma.admin.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    })

    console.log('\n📋 Current Admin Accounts:')
    allAdmins.forEach(admin => {
      console.log(`   ${admin.id}: ${admin.username} (${admin.role}) - Active: ${admin.isActive}`)
    })

    console.log('\n🎉 Admin seeding completed!')
    console.log('\n🔑 Login credentials:')
    console.log('   Cholif / Cholif123 (Super Admin)')
    console.log('   Havizhan / Havizhan123 (Admin)')
    console.log('   Fathan / Fathan123 (Admin)')
    console.log('\n🌐 Admin Panel: https://doaibustore.site/admin/login')

  } catch (error) {
    console.error('❌ Error during admin seeding:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error('💥 Failed to seed admin accounts:', e)
    process.exit(1)
  }) 