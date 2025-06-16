// Set environment variable for testing
process.env.DATABASE_URL = "sqlserver://doaibustore-sv.database.windows.net:1433;database=doaibustore-db;user=doaibustore-sv-admin;password=ganteng#123;encrypt=true;trustServerCertificate=false;connectionTimeout=30"

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

console.log('🌱 Testing admin seeding for Azure deployment...')

// Initialize Prisma with Azure connection
const prisma = new PrismaClient()

async function main() {
  try {
    // Test database connection
    await prisma.$connect()
    console.log('✅ Connected to Azure SQL Database successfully')

    // Admin accounts to create
    const adminAccounts = [
      { 
        username: 'Cholif', 
        password: 'Cholif123', 
        role: 'super_admin' 
      },
      { 
        username: 'Havizhan', 
        password: 'Havizhan123', 
        role: 'admin' 
      },
      { 
        username: 'Fathan', 
        password: 'Fathan123', 
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
          continue
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(admin.password, 12)

        // Create new admin
        const newAdmin = await prisma.admin.create({
          data: {
            username: admin.username,
            password: hashedPassword,
            role: admin.role,
            isActive: true,
            isOnline: false,
          }
        })

        console.log(`✨ Created admin: ${admin.username} (${admin.role}) - ID: ${newAdmin.id}`)
        console.log(`   Login: ${admin.username} / ${admin.password}`)
        
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

    console.log('\n📋 All Admin Accounts:')
    allAdmins.forEach(admin => {
      console.log(`   ${admin.id}: ${admin.username} (${admin.role}) - Active: ${admin.isActive}`)
    })

    console.log('\n🎉 Admin seeding test completed successfully!')
    console.log('\n🔑 Login credentials for Azure deployment:')
    console.log('   Cholif / Cholif123 (Super Admin)')
    console.log('   Havizhan / Havizhan123 (Admin)')  
    console.log('   Fathan / Fathan123 (Admin)')

  } catch (error) {
    console.error('❌ Error during admin seeding test:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error('💥 Failed to test admin seeding:', e.message)
    process.exit(1)
  }) 