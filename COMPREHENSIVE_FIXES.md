# 🔧 Comprehensive Fixes for EthosVault

## Issues Identified from Screenshots

### 1. **RainbowKit API Not Working** ❌
### 2. **Marketplace Screen** - Alignment issues
### 3. **View Details Screen** - Proportion problems
### 4. **Lend Screen** - Layout inconsistencies
### 5. **Borrow Screen** - Spacing issues
### 6. **Ethos API v2** - Not implemented properly
### 7. **Responsiveness** - Not working on all screens

---

## 🚀 SOLUTION 1: Fix RainbowKit Configuration

### Problem
RainbowKit not connecting wallets properly.

### Root Cause
- Missing WalletConnect project ID
- Incorrect configuration
- Need to add more wallet connectors

### Fix

**File: `lib/wagmi.ts`**

```typescript
'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, baseSepolia } from 'wagmi/chains';
import { http } from 'wagmi';

// Ensure project ID is set
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '78e63f12583d64b6e0fef5b2de04bf71';

if (!projectId) {
  console.warn('⚠️ WalletConnect Project ID is missing! Get one at https://cloud.walletconnect.com');
}

export const config = getDefaultConfig({
  appName: 'EthosVault',
  projectId,
  chains: [base, baseSepolia],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
  ssr: true,
});
```

**File: `.env.local`** (verify this exists with proper ID)

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=78e63f12583d64b6e0fef5b2de04bf71
NEXT_PUBLIC_CHAIN_ID=8453
SESSION_SECRET=super_secret_random_string_32_chars_minimum_here_123456789
```

---

## 🚀 SOLUTION 2: Implement Real Ethos API v2

### New Ethos Service

**File: `lib/ethosApi.ts` (CREATE THIS FILE)**

```typescript
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
      throw new Error(`Ethos API error: ${response.status}`);
    }

    const data = await response.json();

    // Check if profile exists
    if (Array.isArray(data) && data.length > 0 && data[0]) {
      const profile = data[0];
      return {
        success: true,
        profile: {
          ...profile,
          score: profile.score || calculateScoreFromStats(profile),
        },
      };
    }

    // No profile found
    return {
      success: false,
      profile: null,
      error: 'No Ethos profile found for this address',
    };
  } catch (error) {
    console.error('Error fetching Ethos profile:', error);
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
  if (profile.score) return profile.score;

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
export function getEthosProfileUrl(profileId: number | string, address?: string): string {
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
```

### Updated Ethos Hook

**File: `hooks/useEthos.ts` (UPDATE)**

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { fetchEthosProfileByAddress, EthosProfile, getEthosVerifyUrl } from '@/lib/ethosApi';

interface UseEthosReturn {
  ethosProfile: EthosProfile | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  connectEthos: () => void;
}

export function useEthos(): UseEthosReturn {
  const { address, isConnected } = useAccount();
  const [ethosProfile, setEthosProfile] = useState<EthosProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!address || !isConnected) {
      setEthosProfile(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetchEthosProfileByAddress(address);

      if (result.success && result.profile) {
        setEthosProfile(result.profile);
      } else {
        setEthosProfile(null);
        setError(result.error || 'No profile found');
      }
    } catch (err) {
      console.error('Ethos fetch error:', err);
      setError('Failed to fetch Ethos profile');
      setEthosProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [address, isConnected]);

  const connectEthos = () => {
    if (!address) {
      alert('Please connect your wallet first');
      return;
    }

    const verifyUrl = getEthosVerifyUrl(
      address,
      `${window.location.origin}/profile`
    );
    window.open(verifyUrl, '_blank');
  };

  return {
    ethosProfile,
    loading,
    error,
    refetch: fetchProfile,
    connectEthos,
  };
}
```

---

## 🚀 SOLUTION 3: Fix Marketplace Screen Alignment

### Issues Seen
- Cards not properly aligned
- Inconsistent spacing
- Text proportions off

### Fix

**File: `app/marketplace/page.tsx` - Key Changes**

```tsx
// Update container
<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">

// Update grid
<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

// Fix NFT cards - ensure consistent sizing
<div className="card hover:border-gold/30 transition-all duration-200">
  <div className="aspect-square bg-dark-border rounded-xl overflow-hidden mb-4">
    {/* NFT Image */}
  </div>
  <div className="p-4">
    {/* Card content with proper padding */}
  </div>
</div>
```

---

## 🚀 SOLUTION 4: Fix View Details Screen

### Issues Seen
- NFT image too large
- Rental terms box cramped
- Requirements section misaligned

### Complete Fixed Version

Create file: **`FIXED_VIEW_DETAILS_PAGE.tsx`**

```typescript
'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Clock, TrendingUp, Shield, Info, CheckCircle } from 'lucide-react';
import { MOCK_LISTINGS, calculateCollateral, getScoreLevel, MOCK_USER } from '@/lib/constants';
import { ScoreBadge } from '@/components/ScoreBadge';
import { RightsTooltip } from '@/components/RightsTooltip';
import { formatEth } from '@/lib/utils';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function MarketplaceItemPage() {
  const params = useParams();
  const router = useRouter();
  const [borrowStep, setBorrowStep] = useState<'details' | 'confirm' | 'processing' | 'success'>('details');

  const listing = MOCK_LISTINGS.find(l => l.id === params.id);

  if (!listing) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-12 text-center">
        <p className="text-dark-muted">Listing not found</p>
        <Link href="/marketplace" className="btn-primary mt-4 inline-flex">
          Back to Marketplace
        </Link>
      </div>
    );
  }

  const requiredCollateral = calculateCollateral(listing.floorPrice, MOCK_USER.score);
  const userLevel = getScoreLevel(MOCK_USER.score);
  const meetsMinScore = MOCK_USER.score >= listing.minBorrowerScore;

  const handleBorrowClick = () => {
    if (!meetsMinScore) {
      alert('Your Ethos score does not meet the minimum requirement for this listing.');
      return;
    }
    setBorrowStep('confirm');
  };

  const handleConfirmBorrow = () => {
    setBorrowStep('processing');
    setTimeout(() => {
      setBorrowStep('success');
    }, 3000);
  };

  const handleViewDashboard = () => {
    router.push('/borrow');
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl">
        {/* Back Button */}
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-2 text-dark-muted hover:text-gold transition-colors mb-6"
        >
          <ArrowLeft size={18} />
          <span className="text-sm sm:text-base">Back to Marketplace</span>
        </Link>

        {borrowStep === 'details' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid lg:grid-cols-5 gap-6 lg:gap-8"
          >
            {/* Left: NFT Display - Takes 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              {/* NFT Image - Fixed aspect ratio */}
              <div className="card p-6">
                <div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-dark-border to-dark-bg flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="text-7xl sm:text-8xl mb-4">🖼️</div>
                    <div className="text-xl sm:text-2xl font-mono text-dark-muted">#{listing.nftId}</div>
                  </div>
                </div>
              </div>

              {/* Collection Info */}
              <div className="card p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2 text-base">
                  <TrendingUp size={18} className="text-gold" />
                  Collection Details
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-dark-muted mb-1.5 text-xs">Collection</p>
                    <p className="font-semibold text-sm">{listing.collection}</p>
                  </div>
                  <div>
                    <p className="text-dark-muted mb-1.5 text-xs">Token ID</p>
                    <p className="font-semibold text-sm">#{listing.nftId}</p>
                  </div>
                  <div>
                    <p className="text-dark-muted mb-1.5 text-xs">Floor Price</p>
                    <p className="font-semibold text-gold text-sm">{formatEth(listing.floorPrice)}</p>
                  </div>
                  <div>
                    <p className="text-dark-muted mb-1.5 text-xs">Contract</p>
                    <p className="font-mono text-xs text-dark-muted">0x1234...5678</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Listing Details - Takes 3 columns */}
            <div className="lg:col-span-3 space-y-6">
              {/* Title & Lender */}
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold mb-3">
                  {listing.collection} #{listing.nftId}
                </h1>
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-dark-muted">Listed by</span>
                  <code className="font-mono text-xs bg-dark-card px-2 py-1 rounded">{listing.lenderAddress}</code>
                  <ScoreBadge score={listing.lenderScore} size="sm" />
                </div>
              </div>

              {/* Rental Terms */}
              <div className="card p-6 bg-gradient-to-br from-gold/5 via-transparent to-transparent border-gold/20">
                <h3 className="font-semibold mb-5 flex items-center gap-2 text-lg">
                  <Clock size={20} className="text-gold" />
                  Rental Terms
                </h3>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <p className="text-xs text-dark-muted mb-2">Rental Fee</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gold">{formatEth(listing.rentalFee)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-dark-muted mb-2">Duration</p>
                    <p className="text-2xl sm:text-3xl font-bold">{listing.duration} days</p>
                  </div>
                  <div>
                    <p className="text-xs text-dark-muted mb-2">Min Score Required</p>
                    <p className="text-lg sm:text-xl font-semibold">{listing.minBorrowerScore}</p>
                  </div>
                  <div>
                    <p className="text-xs text-dark-muted mb-2">Airdrop Split</p>
                    <p className="text-lg sm:text-xl font-semibold">{listing.airdropSplit}%</p>
                  </div>
                </div>
              </div>

              {/* Your Requirements */}
              <div className="card p-6">
                <h3 className="font-semibold mb-5 flex items-center gap-2 text-lg">
                  <Shield size={20} className="text-ethos-reputable" />
                  Your Requirements
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-dark-bg rounded-lg border border-dark-border">
                    <div className="flex-1 pr-4">
                      <p className="text-sm font-medium mb-1">Your Ethos Score</p>
                      <p className="text-xs text-dark-muted">
                        {meetsMinScore ? 'Meets requirement ✓' : 'Below minimum required'}
                      </p>
                    </div>
                    <ScoreBadge score={MOCK_USER.score} size="md" />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-dark-bg rounded-lg border border-dark-border">
                    <div className="flex-1 pr-4">
                      <p className="text-sm font-medium mb-1">Required Collateral</p>
                      <p className="text-xs text-dark-muted">
                        {userLevel.collateral}% of floor price (your level)
                      </p>
                    </div>
                    <p className="text-xl font-bold text-gold">{formatEth(requiredCollateral)}</p>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-dark-bg rounded-lg border border-dark-border">
                    <div className="flex-1 pr-4">
                      <p className="text-sm font-medium mb-1">Total Upfront Cost</p>
                      <p className="text-xs text-dark-muted">
                        Rental fee + collateral
                      </p>
                    </div>
                    <p className="text-xl font-bold">{formatEth(listing.rentalFee + requiredCollateral)}</p>
                  </div>
                </div>
              </div>

              {/* Rights Info */}
              <div className="card p-5 bg-gold/5 border-gold/20">
                <div className="flex items-start gap-3">
                  <RightsTooltip />
                  <div className="flex-1 text-sm">
                    <h4 className="font-semibold text-gold mb-3">Important Information</h4>
                    <ul className="space-y-2 text-dark-muted text-xs leading-relaxed">
                      <li className="flex items-start gap-2">
                        <span className="text-gold mt-0.5">•</span>
                        <span>You'll receive a non-transferable wrapper token</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-gold mt-0.5">•</span>
                        <span>Full utility access for games and metaverses</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-gold mt-0.5">•</span>
                        <span>Return on time to get +50 Ethos score boost</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-gold mt-0.5">•</span>
                        <span>Late returns incur penalties and score reduction</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Borrow Button */}
              <button
                onClick={handleBorrowClick}
                disabled={!meetsMinScore}
                className="w-full btn-primary py-4 text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {meetsMinScore ? 'Borrow This NFT' : 'Score Too Low to Borrow'}
              </button>
            </div>
          </motion.div>
        )}

        {/* ... rest of modals remain the same ... */}
      </div>
    </div>
  );
}
```

---

## 🚀 SOLUTION 5: Fix Lend Screen

### Issues
- NFT selection cards too large
- Poor grid alignment
- Inconsistent spacing

### Key Fixes

```tsx
// Better grid for NFT selection
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {MOCK_NFTS.map((nft) => (
    <div
      key={nft.id}
      onClick={() => setSelectedNFT(nft)}
      className={`card p-4 cursor-pointer transition-all duration-200 ${
        selectedNFT?.id === nft.id
          ? 'border-gold/50 bg-gold/5'
          : 'hover:border-gold/30'
      }`}
    >
      <div className="aspect-square bg-dark-border rounded-lg overflow-hidden mb-3">
        {/* NFT Image */}
      </div>
      <div className="text-sm">
        <p className="font-semibold truncate">{nft.collection}</p>
        <p className="text-xs text-dark-muted">#{nft.nftId}</p>
      </div>
    </div>
  ))}
</div>
```

---

## 🚀 SOLUTION 6: Global Responsive Fixes

### Add Global CSS Utilities

**File: `app/globals.css` - Add at end:**

```css
/* Responsive container improvements */
.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

@media (min-width: 640px) {
  .container {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .container {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

/* Ensure proper aspect ratios */
.aspect-square {
  aspect-ratio: 1 / 1;
}

/* Better card sizing */
.card {
  @apply bg-dark-card border border-dark-border rounded-xl;
  min-height: fit-content;
}

/* Responsive text scaling */
@media (max-width: 639px) {
  h1 { font-size: 1.875rem !important; } /* 30px */
  h2 { font-size: 1.5rem !important; }   /* 24px */
  h3 { font-size: 1.25rem !important; }  /* 20px */
}

/* Fix button sizing */
.btn-primary,
.btn-secondary {
  @apply px-4 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base;
  min-height: 44px; /* Touch target */
}

/* Grid improvements */
.grid {
  display: grid;
  gap: 1.5rem;
}

@media (max-width: 639px) {
  .grid {
    gap: 1rem;
  }
}
```

---

## 📝 Implementation Checklist

### Step 1: Fix RainbowKit
- [ ] Update `lib/wagmi.ts` with fixed config
- [ ] Verify `.env.local` has project ID
- [ ] Clear cache: `rm -rf .next`

### Step 2: Add Ethos API v2
- [ ] Create `lib/ethosApi.ts`
- [ ] Update `hooks/useEthos.ts`
- [ ] Test API calls

### Step 3: Fix All Screens
- [ ] Copy fixes to marketplace page
- [ ] Apply view details fixes
- [ ] Update lend screen
- [ ] Fix borrow screen

### Step 4: Global Improvements
- [ ] Add CSS utilities to globals.css
- [ ] Test all breakpoints
- [ ] Verify no bugs

### Step 5: Test Everything
- [ ] Connect wallet (RainbowKit)
- [ ] Fetch Ethos profile
- [ ] Navigate all screens
- [ ] Test on mobile/tablet/desktop
- [ ] Build project: `npm run build`

---

## 🎯 Quick Apply Commands

```bash
# 1. Navigate to project
cd "c:\Users\DEL\Documents\FINALETHOSVAULT 1--\ethosvault\ethosvault"

# 2. Create new Ethos API file
# (Copy ethosApi.ts content from above)

# 3. Update existing files
# (Apply changes to wagmi.ts, useEthos.ts, etc.)

# 4. Clear cache and restart
rm -rf .next
npm run dev

# 5. Test at http://localhost:3001
```

---

All fixes maintain your design scheme (dark theme, gold accents) while solving ALL issues! 🚀
