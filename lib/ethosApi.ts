'use client';

// Ethos API v2 Integration
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
 * Fetch Ethos profile by wallet address using API v2
 */
export async function fetchEthosProfileByAddress(
  address: string
): Promise<EthosApiResponse> {
  try {
    // Normalize address
    const normalizedAddress = address.toLowerCase();

    console.log('🔍 Fetching Ethos profile for:', normalizedAddress);

    // Call Ethos API v2
    const response = await fetch(`${ETHOS_API_BASE}/api/v2/users/by/address`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        addresses: [normalizedAddress],
      }),
    });

    if (!response.ok) {
      throw new Error(`Ethos API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('📦 Ethos API response:', data);

    // Check if profile exists
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

      console.log('✅ Ethos profile found:', ethosProfile);

      return {
        success: true,
        profile: ethosProfile,
      };
    }

    // No profile found
    console.log('❌ No Ethos profile found for address');
    return {
      success: false,
      profile: null,
      error: 'No Ethos profile found for this address',
    };
  } catch (error) {
    console.error('❌ Error fetching Ethos profile:', error);
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

  // Fallback calculation based on XP and influence
  const xp = profile.xpTotal || 0;
  const influence = profile.influenceFactor || 0;

  // Simple formula: normalize to 0-2800 scale
  const baseScore = Math.min(xp / 10, 2000);
  const influenceBonus = influence * 800;

  return Math.round(Math.min(baseScore + influenceBonus, 2800));
}

/**
 * Get direct link to Ethos profile
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

/**
 * Get Ethos verification/create profile URL
 */
export function getEthosVerifyUrl(address: string, callback?: string): string {
  const params = new URLSearchParams({
    address,
    ...(callback && { callback }),
  });
  return `${ETHOS_APP_BASE}/verify?${params.toString()}`;
}

/**
 * Get alternative single address endpoint
 */
export async function fetchEthosProfileSingleAddress(
  address: string
): Promise<EthosApiResponse> {
  try {
    const normalizedAddress = address.toLowerCase();

    const response = await fetch(`${ETHOS_API_BASE}/api/v2/user/by/address/${normalizedAddress}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return {
          success: false,
          profile: null,
          error: 'No profile found',
        };
      }
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (data) {
      const ethosProfile: EthosProfile = {
        id: data.id || 0,
        profileId: data.profileId || data.id || 0,
        displayName: data.displayName || null,
        username: data.username || null,
        avatarUrl: data.avatarUrl || null,
        description: data.description || null,
        score: data.score || calculateScoreFromStats(data),
        status: data.status || 'ACTIVE',
        userkeys: data.userkeys || [],
        xpTotal: data.xpTotal || 0,
        influenceFactor: data.influenceFactor || 0,
        links: {
          profile: data.links?.profile || `${ETHOS_APP_BASE}/profile/${data.profileId || data.id}`,
        },
        stats: data.stats || { review: {}, vouch: {} },
        verified: true,
      };

      return {
        success: true,
        profile: ethosProfile,
      };
    }

    return {
      success: false,
      profile: null,
      error: 'No profile data',
    };
  } catch (error) {
    console.error('Single address fetch error:', error);
    return {
      success: false,
      profile: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
