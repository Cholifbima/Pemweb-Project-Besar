import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding admin accounts...')

  // Admin accounts to create
  const adminAccounts = [
    { username: 'Cholif', password: 'Cholif123', role: 'super_admin' },
    { username: 'Havizhan', password: 'Havizhan123', role: 'admin' },
    { username: 'Fathan', password: 'Fathan123', role: 'admin' },
  ]

  for (const admin of adminAccounts) {
    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { username: admin.username }
    })

    if (existingAdmin) {
      console.log(`✅ Admin ${admin.username} already exists`)
      continue
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(admin.password, 12)

    // Create admin
    await prisma.admin.create({
      data: {
        username: admin.username,
        password: hashedPassword,
        role: admin.role,
        isActive: true,
      }
    })

    console.log(`✨ Created admin: ${admin.username} (${admin.role})`)
  }

  console.log('🎉 Admin seeding completed!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error seeding admin accounts:', e)
    await prisma.$disconnect()
    process.exit(1)
  }) 