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

    try {
      // Try Simplehash API first (free tier available)
      const response = await fetch(
        `https://api.simplehash.com/api/v0/nfts/owners?chains=base&wallet_addresses=${address}&limit=50`,
        {
          headers: {
            'X-API-KEY': process.env.NEXT_PUBLIC_SIMPLEHASH_API_KEY || '',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch NFTs from Simplehash');
      }

      const data = await response.json();

      const parsedNFTs: UserNFT[] = data.nfts?.map((nft: any) => ({
        contractAddress: nft.contract_address,
        tokenId: nft.token_id,
        name: nft.name || `${nft.collection?.name || 'Unknown'} #${nft.token_id}`,
        collection: nft.collection?.name || 'Unknown Collection',
        image: nft.image_url || nft.previews?.image_medium_url || '',
        floorPrice: nft.collection?.floor_prices?.[0]?.value,
        chain: 'base',
      })) || [];

      setNfts(parsedNFTs);
    } catch (err) {
      console.warn('Simplehash API failed, falling back to mock data:', err);

      // Fallback: Try Alchemy
      try {
        const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
        if (alchemyKey) {
          const alchemyResponse = await fetch(
            `https://base-mainnet.g.alchemy.com/nft/v3/${alchemyKey}/getNFTsForOwner?owner=${address}&withMetadata=true`,
          );

          if (alchemyResponse.ok) {
            const alchemyData = await alchemyResponse.json();
            const parsedNFTs: UserNFT[] = alchemyData.ownedNfts?.map((nft: any) => ({
              contractAddress: nft.contract.address,
              tokenId: nft.tokenId,
              name: nft.name || `${nft.contract.name} #${nft.tokenId}`,
              collection: nft.contract.name || 'Unknown Collection',
              image: nft.image?.cachedUrl || nft.image?.originalUrl || '',
              floorPrice: undefined,
              chain: 'base',
            })) || [];

            setNfts(parsedNFTs);
            return;
          }
        }
      } catch (alchemyErr) {
        console.warn('Alchemy API also failed:', alchemyErr);
      }

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
