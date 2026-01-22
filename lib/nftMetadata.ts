/**
 * NFT Metadata Utilities
 *
 * Functions to fetch NFT metadata, images, and floor prices
 */

export interface NFTMetadata {
  name: string;
  collection: string;
  image: string;
  floorPrice: number;
  description?: string;
}

/**
 * Fetch NFT metadata using Alchemy
 */
export async function fetchNFTMetadata(
  contractAddress: string,
  tokenId: string | bigint
): Promise<NFTMetadata | null> {
  const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
  if (!alchemyKey) {
    console.warn('Alchemy API key not configured');
    return null;
  }

  const chainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '8453');
  const network = chainId === 84532 ? 'base-sepolia' : 'base-mainnet';

  try {
    const tokenIdStr = typeof tokenId === 'bigint' ? tokenId.toString() : tokenId;
    const url = `https://${network}.g.alchemy.com/nft/v3/${alchemyKey}/getNFTMetadata?contractAddress=${contractAddress}&tokenId=${tokenIdStr}`;

    console.log('🔍 Fetching NFT metadata:', contractAddress, tokenIdStr);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    const metadata: NFTMetadata = {
      name: data.name || data.title || `#${tokenIdStr}`,
      collection: data.contract?.name || data.contract?.symbol || 'Unknown',
      image: data.image?.cachedUrl || data.image?.originalUrl || data.media?.[0]?.gateway || '',
      floorPrice: data.contract?.openSeaMetadata?.floorPrice || 0.5,
      description: data.description,
    };

    console.log('✅ Fetched NFT metadata:', metadata);
    return metadata;
  } catch (error) {
    console.error('Failed to fetch NFT metadata:', error);
    return null;
  }
}

/**
 * Fetch multiple NFT metadata in parallel
 */
export async function fetchMultipleNFTMetadata(
  nfts: Array<{ contractAddress: string; tokenId: string | bigint }>
): Promise<Map<string, NFTMetadata>> {
  const metadataMap = new Map<string, NFTMetadata>();

  const promises = nfts.map(async (nft) => {
    const metadata = await fetchNFTMetadata(nft.contractAddress, nft.tokenId);
    if (metadata) {
      const key = `${nft.contractAddress}-${nft.tokenId}`;
      metadataMap.set(key, metadata);
    }
  });

  await Promise.all(promises);
  return metadataMap;
}

/**
 * Get floor price for an NFT collection
 */
export async function getCollectionFloorPrice(contractAddress: string): Promise<number> {
  const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
  if (!alchemyKey) return 0.5; // Default

  const chainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '8453');
  const network = chainId === 84532 ? 'base-sepolia' : 'base-mainnet';

  try {
    const url = `https://${network}.g.alchemy.com/nft/v3/${alchemyKey}/getContractMetadata?contractAddress=${contractAddress}`;
    const response = await fetch(url);

    if (response.ok) {
      const data = await response.json();
      return data.openSeaMetadata?.floorPrice || 0.5;
    }
  } catch (error) {
    console.error('Failed to fetch floor price:', error);
  }

  return 0.5; // Default fallback
}
