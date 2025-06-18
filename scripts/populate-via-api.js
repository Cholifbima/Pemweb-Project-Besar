// Script to populate missing games via development API
const completeGamesList = [
  {
    id: 'mobile-legends',
    name: 'Mobile Legends',
    category: 'topup',
    description: 'MOBA game paling populer di Indonesia',
    publisher: 'Moonton',
    rating: 4.5,
    isPopular: true,
    hasTopUp: true,
    hasBoost: false,
    topUpItems: [
      { id: 'ml-86', name: '86 Diamonds', amount: 86, price: 20000, isPopular: true },
      { id: 'ml-172', name: '172 Diamonds', amount: 172, price: 40000 },
      { id: 'ml-257', name: '257 Diamonds', amount: 257, price: 60000 },
      { id: 'ml-344', name: '344 Diamonds', amount: 344, price: 80000 },
      { id: 'ml-429', name: '429 Diamonds', amount: 429, price: 100000 },
      { id: 'ml-514', name: '514 Diamonds', amount: 514, price: 120000 }
    ]
  },
  {
    id: 'dota-2',
    name: 'Dota 2',
    category: 'topup',
    description: 'MOBA klasik dengan gameplay mendalam',
    publisher: 'Valve',
    rating: 4.3,
    isPopular: true,
    hasTopUp: true,
    hasBoost: false,
    topUpItems: [
      { id: 'dota-5', name: '$5 Steam Wallet', amount: 5, price: 75000, isPopular: true },
      { id: 'dota-10', name: '$10 Steam Wallet', amount: 10, price: 150000 },
      { id: 'dota-20', name: '$20 Steam Wallet', amount: 20, price: 300000 },
      { id: 'dota-50', name: '$50 Steam Wallet', amount: 50, price: 750000 }
    ]
  },
  {
    id: 'pubg-mobile',
    name: 'PUBG Mobile',
    category: 'topup',
    description: 'Battle royale terpopuler dengan gameplay realistis',
    publisher: 'Tencent Games',
    rating: 4.4,
    isPopular: true,
    hasTopUp: true,
    hasBoost: false,
    topUpItems: [
      { id: 'pubg-60', name: '60 UC', amount: 60, price: 15000 },
      { id: 'pubg-325', name: '325 UC', amount: 325, price: 75000, isPopular: true },
      { id: 'pubg-660', name: '660 UC', amount: 660, price: 150000 },
      { id: 'pubg-1800', name: '1800 UC', amount: 1800, price: 400000 }
    ]
  },
  {
    id: 'free-fire',
    name: 'Free Fire',
    category: 'topup',
    description: 'Battle royale dengan gameplay cepat dan seru',
    publisher: 'Garena',
    rating: 4.2,
    isPopular: true,
    hasTopUp: true,
    hasBoost: false,
    topUpItems: [
      { id: 'ff-70', name: '70 Diamonds', amount: 70, price: 15000 },
      { id: 'ff-355', name: '355 Diamonds', amount: 355, price: 75000, isPopular: true },
      { id: 'ff-720', name: '720 Diamonds', amount: 720, price: 150000 },
      { id: 'ff-1450', name: '1450 Diamonds', amount: 1450, price: 300000 }
    ]
  },
  {
    id: 'valorant',
    name: 'Valorant',
    category: 'topup',
    description: 'FPS taktis dengan karakter unik dan ability khusus',
    publisher: 'Riot Games',
    rating: 4.4,
    isPopular: true,
    hasTopUp: true,
    hasBoost: false,
    topUpItems: [
      { id: 'val-420', name: '420 VP', amount: 420, price: 50000 },
      { id: 'val-700', name: '700 VP', amount: 700, price: 85000, isPopular: true },
      { id: 'val-1375', name: '1375 VP', amount: 1375, price: 150000 },
      { id: 'val-2400', name: '2400 VP', amount: 2400, price: 250000 }
    ]
  },
  {
    id: 'clash-royale',
    name: 'Clash Royale',
    category: 'topup',
    description: 'Strategy card game dengan tower defense elements',
    publisher: 'Supercell',
    rating: 4.1,
    isPopular: false,
    hasTopUp: true,
    hasBoost: false,
    topUpItems: [
      { id: 'cr-80', name: '80 Gems', amount: 80, price: 15000 },
      { id: 'cr-500', name: '500 Gems', amount: 500, price: 75000, isPopular: true },
      { id: 'cr-1200', name: '1200 Gems', amount: 1200, price: 150000 },
      { id: 'cr-2500', name: '2500 Gems', amount: 2500, price: 300000 }
    ]
  },
  {
    id: 'asphalt-9',
    name: 'Asphalt 9',
    category: 'topup',
    description: 'Racing game dengan grafis console dan mobil-mobil mewah',
    publisher: 'Gameloft',
    rating: 4.1,
    isPopular: false,
    hasTopUp: true,
    hasBoost: false,
    topUpItems: [
      { id: 'a9-60', name: '60 Tokens', amount: 60, price: 15000 },
      { id: 'a9-300', name: '300 Tokens', amount: 300, price: 75000, isPopular: true },
      { id: 'a9-750', name: '750 Tokens', amount: 750, price: 150000 },
      { id: 'a9-1500', name: '1500 Tokens', amount: 1500, price: 300000 }
    ]
  },
  // Boost games
  {
    id: 'mobile-legends-boost',
    name: 'Mobile Legends (Boost)',
    category: 'boost',
    description: 'MOBA game paling populer di Indonesia',
    publisher: 'Moonton',
    rating: 4.5,
    isPopular: true,
    hasTopUp: false,
    hasBoost: true,
    boostServices: [
      { 
        id: 'ml-rank-boost', 
        name: 'Rank Boost', 
        description: 'Naik rank dengan bantuan pro player',
        price: 50000, 
        duration: '1-3 hari',
        features: ['Win rate 90%+', 'Pro player', 'Aman & terpercaya'],
        isPopular: true 
      },
      { 
        id: 'ml-mythic-boost', 
        name: 'Mythic Push', 
        description: 'Push ke Mythic dengan cepat',
        price: 150000, 
        duration: '3-7 hari',
        features: ['Target Mythic', 'Pro player berpengalaman', '100% aman']
      }
    ]
  },
  {
    id: 'dota2',
    name: 'Dota 2 (Boost)',
    category: 'boost',
    description: 'MOBA klasik dengan gameplay mendalam',
    publisher: 'Valve',
    rating: 4.3,
    isPopular: true,
    hasTopUp: false,
    hasBoost: true,
    boostServices: [
      { 
        id: 'dota-mmr-boost', 
        name: 'MMR Boost', 
        description: 'Tingkatkan MMR dengan bantuan pro',
        price: 50000, 
        duration: '1-2 hari',
        features: ['MMR guaranteed', 'Pro player', 'Winrate tinggi'],
        isPopular: true 
      }
    ]
  },
  {
    id: 'pubg-mobile-boost',
    name: 'PUBG Mobile (Boost)',
    category: 'boost',
    description: 'Battle royale terpopuler dengan gameplay realistis',
    publisher: 'Tencent Games',
    rating: 4.4,
    isPopular: true,
    hasTopUp: false,
    hasBoost: true,
    boostServices: [
      { 
        id: 'pubg-tier-boost', 
        name: 'Tier Push', 
        description: 'Push tier dengan cepat dan aman',
        price: 50000, 
        duration: '2-4 hari',
        features: ['Pro player', 'High KD ratio', 'Aman 100%'],
        isPopular: true 
      }
    ]
  },
  {
    id: 'free-fire-boost',
    name: 'Free Fire (Boost)',
    category: 'boost',
    description: 'Battle royale dengan gameplay cepat dan seru',
    publisher: 'Garena',
    rating: 4.2,
    isPopular: true,
    hasTopUp: false,
    hasBoost: true,
    boostServices: [
      { 
        id: 'ff-rank-boost', 
        name: 'Rank Boost', 
        description: 'Naik rank dengan bantuan pro player',
        price: 50000, 
        duration: '1-3 hari',
        features: ['Win rate tinggi', 'Pro player', 'Cepat & aman'],
        isPopular: true 
      }
    ]
  },
  {
    id: 'valorant-boost',
    name: 'Valorant (Boost)',
    category: 'boost',
    description: 'FPS taktis dengan karakter unik dan ability khusus',
    publisher: 'Riot Games',
    rating: 4.4,
    isPopular: true,
    hasTopUp: false,
    hasBoost: true,
    boostServices: [
      { 
        id: 'val-rank-boost', 
        name: 'Rank Boost', 
        description: 'Boost rank dengan pro player berpengalaman',
        price: 100000, 
        duration: '2-5 hari',
        features: ['Pro player berpengalaman', 'Win rate 90%+', '100% aman & terpercaya'],
        isPopular: true 
      }
    ]
  },
  {
    id: 'clash-royale-boost',
    name: 'Clash Royale (Boost)',
    category: 'boost',
    description: 'Strategy card game dengan tower defense elements',
    publisher: 'Supercell',
    rating: 4.1,
    isPopular: false,
    hasTopUp: false,
    hasBoost: true,
    boostServices: [
      { 
        id: 'cr-trophy-boost', 
        name: 'Trophy Push', 
        description: 'Push trophy dengan strategi terbaik',
        price: 75000, 
        duration: '2-4 hari',
        features: ['Expert player', 'Meta deck strategy', 'Trophy guarantee'],
        isPopular: true 
      }
    ]
  }
]

async function populateViaAPI() {
  console.log('🚀 Populating games via API calls...\n')
  
  for (const game of completeGamesList) {
    try {
      const response = await fetch('http://localhost:3000/api/dev/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(game)
      })
      
      if (response.ok) {
        console.log(`✅ Created/Updated: ${game.name}`)
      } else {
        const error = await response.text()
        console.log(`❌ Failed ${game.name}: ${error}`)
      }
    } catch (error) {
      console.log(`❌ Error ${game.name}: ${error.message}`)
    }
  }
  
  console.log('\n🎉 Done! Please check your application.')
}

// Check if we have Node.js fetch (Node 18+) or need to use a library
if (typeof fetch === 'undefined') {
  console.log('❌ This script requires Node.js 18+ or a fetch polyfill')
  console.log('💡 Alternative: Start your dev server and run this in browser console')
  console.log('📋 Copy the completeGamesList and populateViaAPI function to browser')
} else {
  populateViaAPI()
} 