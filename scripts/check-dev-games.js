const { PrismaClient } = require('../generated/client-dev')

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "file:./prisma/dev-new.db"
    }
  }
})

async function checkGames() {
  try {
    console.log('🔍 Checking games in development database...\n')
    
    const games = await prisma.game.findMany({
      orderBy: { name: 'asc' }
    })
    
    console.log(`📊 Total games: ${games.length}\n`)
    
    const topUpGames = games.filter(g => g.hasTopUp)
    const boostGames = games.filter(g => g.hasBoost)
    
    console.log(`🎮 Top-up games: ${topUpGames.length}`)
    topUpGames.forEach(game => {
      console.log(`  - ${game.name} (${game.id}) - ${game.category}`)
    })
    
    console.log(`\n⚡ Boost games: ${boostGames.length}`)
    boostGames.forEach(game => {
      console.log(`  - ${game.name} (${game.id}) - ${game.category}`)
    })
    
    console.log('\n📋 All games:')
    games.forEach(game => {
      const types = []
      if (game.hasTopUp) types.push('topup')
      if (game.hasBoost) types.push('boost')
      console.log(`  - ${game.name} (${game.id}) - ${game.category} [${types.join(', ')}] - Popular: ${game.isPopular}`)
    })
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkGames() 