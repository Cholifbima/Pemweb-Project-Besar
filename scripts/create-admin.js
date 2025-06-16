const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')

async function createAdmin() {
  const prisma = new PrismaClient()
  
  try {
    console.log('🔧 Connecting to database...')
    await prisma.$connect()
    
    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    // Create or update admin
    const admin = await prisma.admin.upsert({
      where: { username: 'admin' },
      update: {
        password: hashedPassword,
        isActive: true,
        isOnline: false
      },
      create: {
        username: 'admin',
        password: hashedPassword,
        role: 'super_admin',
        isActive: true,
        isOnline: false
      }
    })
    
    console.log('✅ Admin created/updated successfully!')
    console.log(`   Username: ${admin.username}`)
    console.log(`   Role: ${admin.role}`)
    console.log(`   Password: admin123`)
    
    // Also create a second admin for testing
    const admin2 = await prisma.admin.upsert({
      where: { username: 'cholif' },
      update: {
        password: hashedPassword,
        isActive: true,
        isOnline: true
      },
      create: {
        username: 'cholif',
        password: hashedPassword,
        role: 'super_admin',
        isActive: true,
        isOnline: true
      }
    })
    
    console.log('✅ Second admin created/updated!')
    console.log(`   Username: ${admin2.username}`)
    console.log(`   Role: ${admin2.role}`)
    console.log(`   Status: Online`)
    
  } catch (error) {
    console.error('❌ Error creating admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin() 