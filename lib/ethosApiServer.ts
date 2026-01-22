/**
 * Server-Side Ethos API Integration
 *
 * This module provides server-side functions for interacting with Ethos API
 * Used in API routes for authentication, score fetching, and profile management
 */

const ETHOS_API_BASE = 'https://api.ethos.network';
const ETHOS_APP_BASE = 'https://app.ethos.network';

export interface EthosProfile {
  id: number;
  profileId: number;
  displayName: string | null;
  username: string | null;
  avatarUrl: string | null;
  description: string | null;
  score: number;
  status: string;
  userkeys: string[];
  xpTotal: number;
  influenceFactor: number;
  links: {
    profile: string;
  };
  stats: {
    review: any;
    vouch: any;
  };
  verified: boolean;
}

export interface EthosApiResponse {
  success: boolean;
  profile: EthosProfile | null;
  error?: string;
}

/**
 * Fetch Ethos profile by wallet address (server-side)
 */
export async function fetchEthosProfileServer(
  address: string
): Promise<EthosApiResponse> {
  try {
    const normalizedAddress = address.toLowerCase();

    console.log('[Ethos API] Fetching profile for:', normalizedAddress);

    const response = await fetch(`${ETHOS_API_BASE}/api/v2/users/by/address`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        addresses: [normalizedAddress],
      }),
      cache: 'no-store', // Don't cache on server
    });

    if (!response.ok) {
      throw new Error(`Ethos API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (Array.isArray(data) && data.length > 0 && data[0]) {
      const profile = data[0];

      const ethosProfile: EthosProfile = {
        id: profile.id || 0,
        profileId: profile.profileId || profile.id || 0,
        displayName: profile.displayName || null,
        username: profile.username || null,
        avatarUrl: profile.avatarUrl || null,
        description: profile.description || null,
        score: profile.score || calculateScoreFromStats(profile),
        status: profile.status || 'ACTIVE',
        userkeys: profile.userkeys || [],
        xpTotal: profile.xpTotal || 0,
        influenceFactor: profile.influenceFactor || 0,
        links: {
          profile: profile.links?.profile || `${ETHOS_APP_BASE}/profile/${profile.profileId || profile.id}`,
        },
        stats: profile.stats || { review: {}, vouch: {} },
        verified: true,
      };

      console.log('[Ethos API] Profile found:', { score: ethosProfile.score, id: ethosProfile.profileId });

      return {
        success: true,
        profile: ethosProfile,
      };
    }

    console.log('[Ethos API] No profile found');
    return {
      success: false,
      profile: null,
      error: 'No Ethos profile found for this address',
    };
  } catch (error) {
    console.error('[Ethos API] Error:', error);
    return {
      success: false,
      profile: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Calculate score from Ethos stats if not directly provided
 */
function calculateScoreFromStats(profile: any): number {
  if (profile.score && profile.score > 0) return profile.score;

  const xp = profile.xpTotal || 0;
  const influence = profile.influenceFactor || 0;

  const baseScore = Math.min(xp / 10, 2000);
  const influenceBonus = influence * 800;

  return Math.round(Math.min(baseScore + influenceBonus, 2800));
}

/**
 * Calculate required collateral in basis points from Ethos score
 * Matches the contract's collateralBpsFromScore function
 *
 * @param score - Ethos score (0-2800)
 * @returns Collateral requirement in basis points (0-10000)
 */
export function calculateCollateralBps(score: number): number {
  const MAX_ETHOS_SCORE = 2800;
  const MAX_COLLATERAL_BPS = 10000;

  if (score >= MAX_ETHOS_SCORE) {
    return 0; // 0% collateral for max score
  }

  // Linear interpolation: higher score → lower collateral
  const bps = MAX_COLLATERAL_BPS - Math.floor((score * MAX_COLLATERAL_BPS) / MAX_ETHOS_SCORE);
  return bps;
}

/**
 * Calculate collateral amount in wei
 *
 * @param floorPriceWei - Floor price in wei
 * @param score - Ethos score
 * @returns Required collateral in wei
 */
export function calculateCollateralAmount(floorPriceWei: bigint, score: number): bigint {
  const bps = BigInt(calculateCollateralBps(score));
  const collateral = (floorPriceWei * bps) / BigInt(10000);
  return collateral;
}

/**
 * Get Ethos profile URL
 */
export function getEthosProfileUrl(profileId: number | string | undefined, address?: string): string {
  if (profileId) {
    return `${ETHOS_APP_BASE}/profile/${profileId}`;
  }
  if (address) {
    return `${ETHOS_APP_BASE}/profile/address/${address}`;
  }
  return ETHOS_APP_BASE;
}
