export interface Game {
  id: string
  name: string
  category: 'moba' | 'battle-royale' | 'mmorpg' | 'fps' | 'card' | 'racing'
  icon: string
  logo?: any // Added logo property for imported image assets
  banner: string
  description: string
  publisher: string
  rating: number
  isPopular: boolean
  hasTopUp: boolean
  hasBoost: boolean
  topUpItems?: TopUpItem[]
  boostServices?: BoostService[]
}

export interface TopUpItem {
  id: string
  name: string
  amount: number
  bonus?: number
  price: number
  originalPrice?: number
  isPopular?: boolean
  description?: string
}

export interface BoostService {
  id: string
  name: string
  description: string
  price: number
  duration: string
  features: string[]
  isPopular?: boolean
}

export const games: Game[] = [
  // MOBA Games
  {
    id: 'mobile-legends',
    name: 'Mobile Legends',
    category: 'moba',
    icon: '🛡️',
    banner: '/images/games/ml-banner.jpg',
    description: 'Game MOBA terpopuler di Indonesia dengan jutaan pemain aktif',
    publisher: 'Moonton',
    rating: 4.5,
    isPopular: true,
    hasTopUp: true,
    hasBoost: true,
    topUpItems: [
      { id: 'ml-86', name: '86 Diamonds', amount: 86, price: 20000, isPopular: true },
      { id: 'ml-172', name: '172 Diamonds', amount: 172, price: 39000 },
      { id: 'ml-257', name: '257 Diamonds', amount: 257, bonus: 6, price: 58000 },
      { id: 'ml-344', name: '344 Diamonds', amount: 344, bonus: 8, price: 77000 },
      { id: 'ml-429', name: '429 Diamonds', amount: 429, bonus: 10, price: 96000 },
      { id: 'ml-514', name: '514 Diamonds', amount: 514, bonus: 12, price: 115000, isPopular: true },
      { id: 'ml-706', name: '706 Diamonds', amount: 706, bonus: 17, price: 154000 },
      { id: 'ml-963', name: '963 Diamonds', amount: 963, bonus: 24, price: 210000 },
      { id: 'ml-1412', name: '1412 Diamonds', amount: 1412, bonus: 35, price: 308000 },
      { id: 'ml-2195', name: '2195 Diamonds', amount: 2195, bonus: 55, price: 479000, isPopular: true },
    ],
    boostServices: [
      {
        id: 'ml-rank-boost',
        name: 'Rank Boost',
        description: 'Naikkan rank dari Epic ke Mythic dengan aman',
        price: 150000,
        duration: '3-7 hari',
        features: ['Win Rate 90%+', 'Main bareng pro player', 'Garansi rank', 'Live streaming'],
        isPopular: true
      },
      {
        id: 'ml-classic-boost',
        name: 'Classic Win Rate',
        description: 'Tingkatkan win rate classic matches',
        price: 75000,
        duration: '1-3 hari',
        features: ['10 match win', 'KDA bagus', 'MVP priority']
      }
    ]
  },
  {
    id: 'dota2',
    name: 'Dota 2',
    category: 'moba',
    icon: '⚔️',
    banner: '/images/games/dota2-banner.jpg',
    description: 'MOBA klasik dengan gameplay yang mendalam dan kompetitif',
    publisher: 'Valve',
    rating: 4.3,
    isPopular: false,
    hasTopUp: true,
    hasBoost: true,
    topUpItems: [
      { id: 'dota2-steam-5', name: 'Steam Wallet $5', amount: 5, price: 75000 },
      { id: 'dota2-steam-10', name: 'Steam Wallet $10', amount: 10, price: 150000, isPopular: true },
      { id: 'dota2-steam-20', name: 'Steam Wallet $20', amount: 20, price: 300000 },
      { id: 'dota2-steam-50', name: 'Steam Wallet $50', amount: 50, price: 750000 },
    ],
    boostServices: [
      {
        id: 'dota2-mmr-boost',
        name: 'MMR Boost',
        description: 'Tingkatkan MMR dengan pemain profesional',
        price: 200000,
        duration: '5-10 hari',
        features: ['+500 MMR', 'Pro player', 'Coaching included'],
        isPopular: true
      }
    ]
  },

  // Battle Royale Games
  {
    id: 'pubg-mobile',
    name: 'PUBG Mobile',
    category: 'battle-royale',
    icon: '🔫',
    banner: '/images/games/pubg-banner.jpg',
    description: 'Battle royale terbaik dengan grafis realistis dan gameplay seru',
    publisher: 'Tencent Games',
    rating: 4.4,
    isPopular: true,
    hasTopUp: true,
    hasBoost: true,
    topUpItems: [
      { id: 'pubg-60', name: '60 UC', amount: 60, price: 15000 },
      { id: 'pubg-325', name: '325 UC', amount: 325, price: 75000, isPopular: true },
      { id: 'pubg-660', name: '660 UC', amount: 660, price: 150000 },
      { id: 'pubg-1800', name: '1800 UC', amount: 1800, price: 400000 },
      { id: 'pubg-3850', name: '3850 UC', amount: 3850, price: 800000, isPopular: true },
    ],
    boostServices: [
      {
        id: 'pubg-tier-boost',
        name: 'Tier Push',
        description: 'Push tier dari Bronze ke Crown/Ace',
        price: 120000,
        duration: '3-5 hari',
        features: ['High K/D ratio', 'Top 10 guarantee', 'Duo/Squad available'],
        isPopular: true
      }
    ]
  },
  {
    id: 'free-fire',
    name: 'Free Fire',
    category: 'battle-royale',
    icon: '🔥',
    banner: '/images/games/ff-banner.jpg',
    description: 'Battle royale dengan match cepat 10 menit yang seru dan adiktif',
    publisher: 'Garena',
    rating: 4.2,
    isPopular: true,
    hasTopUp: true,
    hasBoost: true,
    topUpItems: [
      { id: 'ff-70', name: '70 Diamonds', amount: 70, price: 10000 },
      { id: 'ff-140', name: '140 Diamonds', amount: 140, price: 20000, isPopular: true },
      { id: 'ff-355', name: '355 Diamonds', amount: 355, price: 50000 },
      { id: 'ff-720', name: '720 Diamonds', amount: 720, price: 100000 },
      { id: 'ff-1450', name: '1450 Diamonds', amount: 1450, price: 200000, isPopular: true },
    ],
    boostServices: [
      {
        id: 'ff-rank-push',
        name: 'Rank Push',
        description: 'Naik ke Grandmaster dengan cepat',
        price: 100000,
        duration: '2-4 hari',
        features: ['Booyah guarantee', 'High damage', 'Solo/Duo/Squad']
      }
    ]
  },

  // MMORPG Games
  {
    id: 'genshin-impact',
    name: 'Genshin Impact',
    category: 'mmorpg',
    icon: '🌟',
    banner: '/images/games/genshin-banner.jpg',
    description: 'Open-world RPG dengan grafis anime yang memukau',
    publisher: 'miHoYo',
    rating: 4.6,
    isPopular: true,
    hasTopUp: true,
    hasBoost: true,
    topUpItems: [
      { id: 'gi-60', name: '60 Genesis Crystals', amount: 60, price: 15000 },
      { id: 'gi-300', name: '300 Genesis Crystals', amount: 300, bonus: 30, price: 75000, isPopular: true },
      { id: 'gi-980', name: '980 Genesis Crystals', amount: 980, bonus: 110, price: 250000 },
      { id: 'gi-1980', name: '1980 Genesis Crystals', amount: 1980, bonus: 260, price: 500000 },
      { id: 'gi-3280', name: '3280 Genesis Crystals', amount: 3280, bonus: 600, price: 800000, isPopular: true },
    ],
    boostServices: [
      {
        id: 'gi-abyss-clear',
        name: 'Spiral Abyss Clear',
        description: 'Clear Spiral Abyss Floor 12 dengan 36 stars',
        price: 200000,
        duration: '1-2 hari',
        features: ['36 stars guarantee', 'Optimal team comp', 'Artifact optimization'],
        isPopular: true
      }
    ]
  },

  // FPS Games
  {
    id: 'valorant',
    name: 'Valorant',
    category: 'fps',
    icon: '🎯',
    banner: '/images/games/valorant-banner.jpg',
    description: 'Tactical FPS dengan agent unik dan gameplay kompetitif',
    publisher: 'Riot Games',
    rating: 4.4,
    isPopular: true,
    hasTopUp: true,
    hasBoost: true,
    topUpItems: [
      { id: 'val-475', name: '475 VP', amount: 475, price: 50000 },
      { id: 'val-1000', name: '1000 VP', amount: 1000, price: 100000, isPopular: true },
      { id: 'val-2050', name: '2050 VP', amount: 2050, price: 200000 },
      { id: 'val-3650', name: '3650 VP', amount: 3650, price: 350000 },
      { id: 'val-5350', name: '5350 VP', amount: 5350, price: 500000, isPopular: true },
    ],
    boostServices: [
      {
        id: 'val-rank-boost',
        name: 'Rank Boost',
        description: 'Boost rank dari Iron ke Immortal',
        price: 300000,
        duration: '5-10 hari',
        features: ['Radiant players', 'High RR gain', 'Duo queue available'],
        isPopular: true
      }
    ]
  },

  // Card Games
  {
    id: 'clash-royale',
    name: 'Clash Royale',
    category: 'card',
    icon: '👑',
    banner: '/images/games/cr-banner.jpg',
    description: 'Strategy card game dengan battle real-time yang seru',
    publisher: 'Supercell',
    rating: 4.3,
    isPopular: false,
    hasTopUp: true,
    hasBoost: true,
    topUpItems: [
      { id: 'cr-80', name: '80 Gems', amount: 80, price: 15000 },
      { id: 'cr-500', name: '500 Gems', amount: 500, price: 75000, isPopular: true },
      { id: 'cr-1200', name: '1200 Gems', amount: 1200, price: 150000 },
      { id: 'cr-2500', name: '2500 Gems', amount: 2500, price: 300000 },
      { id: 'cr-6500', name: '6500 Gems', amount: 6500, price: 750000, isPopular: true },
    ],
    boostServices: [
      {
        id: 'cr-trophy-push',
        name: 'Trophy Push',
        description: 'Push trophy ke Master League',
        price: 150000,
        duration: '3-5 hari',
        features: ['Master League', 'Card optimization', 'Deck coaching']
      }
    ]
  },

  // Racing Games
  {
    id: 'asphalt-9',
    name: 'Asphalt 9',
    category: 'racing',
    icon: '🏎️',
    banner: '/images/games/asphalt-banner.jpg',
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
      { id: 'a9-1500', name: '1500 Tokens', amount: 1500, price: 300000 },
    ]
  }
]

export const getGameById = (id: string): Game | undefined => {
  return games.find(game => game.id === id)
}

export const getGamesByCategory = (category: string): Game[] => {
  return games.filter(game => game.category === category)
}

export const getPopularGames = (): Game[] => {
  return games.filter(game => game.isPopular)
}

export const getTopUpGames = (): Game[] => {
  return games.filter(game => game.hasTopUp)
}

export const getBoostGames = (): Game[] => {
  return games.filter(game => game.hasBoost)
} 