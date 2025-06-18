import logoMobileLegends from '@/assets/logo_mobile_legend.png'
import logoDota from '@/assets/logo_dota.png'
import logoPubg from '@/assets/logo_pubg.png'
import logoFreeFire from '@/assets/logo_free_fire.png'
import logoGenshinImpact from '@/assets/logo_genshin_impact.png'
import logoValorant from '@/assets/logo_valorant.png'
import logoClashRoyale from '@/assets/logo_clash_royale.png'
import logoAsphalt9 from '@/assets/logo_asphalt_9.png'

// Game icon mapping
const gameIconMap = {
  'mobile-legends': logoMobileLegends,
  'mobile-legends-topup': logoMobileLegends,
  'mobile-legends-boost': logoMobileLegends,
  'dota-2': logoDota,
  'dota2': logoDota,
  'pubg-mobile': logoPubg,
  'pubg-mobile-boost': logoPubg,
  'free-fire': logoFreeFire,
  'free-fire-topup': logoFreeFire,
  'free-fire-boost': logoFreeFire,
  'genshin-impact': logoGenshinImpact,
  'genshin-impact-topup': logoGenshinImpact,
  'genshin-impact-boost': logoGenshinImpact,
  'valorant': logoValorant,
  'valorant-boost': logoValorant,
  'clash-royale': logoClashRoyale,
  'clash-royale-boost': logoClashRoyale,
  'asphalt-9': logoAsphalt9,
} as const

/**
 * Get game image with priority:
 * 1. Static logo assets (imported images)
 * 2. Uploaded icon URL (Azure Blob or local uploads)
 * 3. Fallback to Mobile Legends logo
 */
export function getGameImage(gameId: string, uploadedIcon?: string | null) {
  // Priority 1: Static assets
  if (gameId in gameIconMap) {
    return gameIconMap[gameId as keyof typeof gameIconMap]
  }
  
  // Priority 2: Uploaded icon
  if (uploadedIcon) {
    // Handle Azure Blob URLs or local uploads
    if (uploadedIcon.startsWith('http') || uploadedIcon.startsWith('/uploads/')) {
      return uploadedIcon
    }
  }
  
  // Priority 3: Fallback
  return logoMobileLegends
}

/**
 * Map game IDs to ensure compatibility between different naming conventions
 */
export function normalizeGameId(gameId: string): string {
  const idMappings: Record<string, string> = {
    'dota2': 'dota-2',
    'mobile-legends-topup': 'mobile-legends',
    'mobile-legends-boost': 'mobile-legends',
    'free-fire-topup': 'free-fire',
    'free-fire-boost': 'free-fire',
    'genshin-impact-topup': 'genshin-impact',
    'genshin-impact-boost': 'genshin-impact',
    'valorant-boost': 'valorant',
    'clash-royale-boost': 'clash-royale',
    'pubg-mobile-boost': 'pubg-mobile',
  }
  
  return idMappings[gameId] || gameId
}

/**
 * Get game redirect URL based on category
 */
export function getGameRedirectUrl(gameId: string, category: string): string {
  if (category === 'topup' || category === 'both') {
    return `/top-up/${gameId}`
  } else if (category === 'boost') {
    return `/boost-services/${gameId}`
  }
  
  // Default to top-up if unclear
  return `/top-up/${gameId}`
} 