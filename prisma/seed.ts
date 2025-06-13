import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create Games
  const games = [
    {
      id: 'mobile-legends',
      name: 'Mobile Legends',
      category: 'MOBA',
      icon: 'https://images.unsplash.com/photo-1592155931584-901ac15763e3?w=200'
    },
    {
      id: 'free-fire',
      name: 'Free Fire',
      category: 'Battle Royale',
      icon: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200'
    },
    {
      id: 'valorant',
      name: 'Valorant',
      category: 'FPS',
      icon: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=200'
    },
    {
      id: 'pubg-mobile',
      name: 'PUBG Mobile',
      category: 'Battle Royale',
      icon: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=200'
    },
    {
      id: 'genshin-impact',
      name: 'Genshin Impact',
      category: 'RPG',
      icon: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=200'
    }
  ]

  for (const game of games) {
    await prisma.game.upsert({
      where: { id: game.id },
      update: game,
      create: game
    })
  }

  console.log('✅ Games seeded successfully')

  // Create Test User
  const hashedPassword = await bcrypt.hash('testuser123', 10)
  
  const testUser = await prisma.user.upsert({
    where: { email: 'test@doaibustore.site' },
    update: {},
    create: {
      email: 'test@doaibustore.site',
      username: 'testuser',
      password: hashedPassword,
      fullName: 'Test User DoaIbu Store',
      phoneNumber: '+62812345678',
      favoriteGames: JSON.stringify(['mobile-legends', 'valorant']),
      totalSpent: 0
    }
  })

  console.log('✅ Test user created:', testUser.username)

  // Create Sample Orders
  const sampleOrders = [
    {
      userId: testUser.id,
      gameId: 'mobile-legends',
      gameName: 'Mobile Legends',
      serviceType: 'topup',
      packageName: '86 Diamonds',
      price: 20000,
      status: 'completed'
    },
    {
      userId: testUser.id,
      gameId: 'valorant',
      gameName: 'Valorant',
      serviceType: 'boost',
      packageName: 'Rank Push Bronze to Silver',
      price: 150000,
      status: 'pending'
    }
  ]

  for (const order of sampleOrders) {
    await prisma.order.create({
      data: order
    })
  }

  console.log('✅ Sample orders created')

  console.log('🎉 Database seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 