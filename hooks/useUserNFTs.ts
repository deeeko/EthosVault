/**
 * User NFTs Hook
 *
 * Fetches NFTs owned by the connected wallet using various NFT APIs.
 * Supports multiple chains and provides loading/error states.
 */

'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

export interface UserNFT {
  contractAddress: string;
  tokenId: string;
  name: string;
  collection: string;
  image: string;
  floorPrice?: number;
  chain: string;
}

/**
 * Hook to fetch user's NFTs from their connected wallet
 * Uses Alchemy/Simplehash/Reservoir APIs
 */
export function useUserNFTs() {
  const { address, isConnected } = useAccount();
  const [nfts, setNfts] = useState<UserNFT[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!address || !isConnected) {
      setNfts([]);
      return;
    }

    fetchUserNFTs();
  }, [address, isConnected]);

  const fetchUserNFTs = async () => {
    if (!address) return;

    setIsLoading(true);
    setError(null);

    // Determine which network we're on
    const chainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '8453');
    const isTestnet = chainId === 84532;

    try {
      // Try Alchemy first (since you have the API key configured)
      const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
      if (alchemyKey) {
        const alchemyNetwork = isTestnet ? 'base-sepolia' : 'base-mainnet';
        const alchemyUrl = `https://${alchemyNetwork}.g.alchemy.com/nft/v3/${alchemyKey}/getNFTsForOwner?owner=${address}&withMetadata=true`;

        console.log('🔍 Fetching NFTs from Alchemy:', alchemyNetwork);

        const alchemyResponse = await fetch(alchemyUrl);

        if (alchemyResponse.ok) {
          const alchemyData = await alchemyResponse.json();
          const parsedNFTs: UserNFT[] = alchemyData.ownedNfts?.map((nft: any) => ({
            contractAddress: nft.contract.address,
            tokenId: nft.tokenId,
            name: nft.name || nft.title || `${nft.contract.name} #${nft.tokenId}`,
            collection: nft.contract.name || 'Unknown Collection',
            image: nft.image?.cachedUrl || nft.image?.originalUrl || nft.media?.[0]?.gateway || '',
            floorPrice: nft.contract?.openSeaMetadata?.floorPrice || 0.5,
            chain: isTestnet ? 'base-sepolia' : 'base',
          })) || [];

          console.log('✅ Found', parsedNFTs.length, 'NFTs via Alchemy');
          setNfts(parsedNFTs);
          return;
        } else {
          console.warn('Alchemy API error:', await alchemyResponse.text());
        }
      }

      // Fallback: Try Simplehash (if configured)
      const simplehashKey = process.env.NEXT_PUBLIC_SIMPLEHASH_API_KEY;
      if (simplehashKey) {
        const chain = isTestnet ? 'base-sepolia' : 'base';
        const response = await fetch(
          `https://api.simplehash.com/api/v0/nfts/owners?chains=${chain}&wallet_addresses=${address}&limit=50`,
          {
            headers: {
              'X-API-KEY': simplehashKey,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const parsedNFTs: UserNFT[] = data.nfts?.map((nft: any) => ({
            contractAddress: nft.contract_address,
            tokenId: nft.token_id,
            name: nft.name || `${nft.collection?.name || 'Unknown'} #${nft.token_id}`,
            collection: nft.collection?.name || 'Unknown Collection',
            image: nft.image_url || nft.previews?.image_medium_url || '',
            floorPrice: nft.collection?.floor_prices?.[0]?.value,
            chain: chain,
          })) || [];

          console.log('✅ Found', parsedNFTs.length, 'NFTs via Simplehash');
          setNfts(parsedNFTs);
          return;
        }
      }

      throw new Error('No NFT APIs configured or all failed');
    } catch (err) {
      console.warn('All NFT APIs failed, showing demo data:', err);

      // Final fallback: Show empty state or mock NFTs for demo
      setError(new Error('Unable to fetch NFTs. Please configure NFT API keys in .env.local'));
      setNfts([
        {
          contractAddress: '0x1234567890123456789012345678901234567890',
          tokenId: '1',
          name: 'Sample NFT #1',
          collection: 'Demo Collection',
          image: '', // Will show placeholder
          floorPrice: 0.5,
          chain: 'base',
        },
        {
          contractAddress: '0x1234567890123456789012345678901234567890',
          tokenId: '2',
          name: 'Sample NFT #2',
          collection: 'Demo Collection',
          image: '',
          floorPrice: 0.8,
          chain: 'base',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    nfts,
    isLoading,
    error,
    refetch: fetchUserNFTs,
  };
}
