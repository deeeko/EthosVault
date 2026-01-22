/**
 * GET /api/marketplace/listings
 *
 * Fetches all NFT listings from the contract and enriches with Ethos data
 * Public endpoint - no auth required
 */

import { NextResponse } from 'next/server';
import { getAllListingsFromContract } from '@/lib/contractServer';
import { fetchEthosProfileServer } from '@/lib/ethosApiServer';
import { fetchNFTMetadata } from '@/lib/nftMetadata';

export async function GET() {
  try {
    console.log('[Marketplace API] Fetching all listings');

    // Get listings from contract
    const contractListings = await getAllListingsFromContract();

    if (!contractListings || contractListings.length === 0) {
      return NextResponse.json({
        success: true,
        listings: [],
        count: 0,
      });
    }

    // Enrich listings with Ethos data and NFT metadata
    const enrichedListings = await Promise.all(
      contractListings.map(async (listing: any, index: number) => {
        try {
          // Fetch lender's Ethos profile
          const ethosResponse = await fetchEthosProfileServer(listing.lender);

          // Fetch NFT metadata
          const nftMetadata = await fetchNFTMetadata(
            listing.nft,
            listing.tokenId.toString()
          );

          return {
            id: index,
            lender: listing.lender,
            nft: listing.nft,
            tokenId: listing.tokenId.toString(),
            available: listing.available,
            lenderEthosScore: ethosResponse.profile?.score || 0,
            lenderEthosProfileId: ethosResponse.profile?.profileId || 0,
            lenderDisplayName: ethosResponse.profile?.displayName || null,
            lenderAvatarUrl: ethosResponse.profile?.avatarUrl || null,
            nftName: nftMetadata?.name || `#${listing.tokenId.toString()}`,
            nftCollection: nftMetadata?.collection || 'Unknown Collection',
            nftImage: nftMetadata?.image || '',
            floorPrice: nftMetadata?.floorPrice || 0,
          };
        } catch (err) {
          console.error(`[Marketplace API] Error enriching listing ${index}:`, err);
          return {
            id: index,
            lender: listing.lender,
            nft: listing.nft,
            tokenId: listing.tokenId.toString(),
            available: listing.available,
            lenderEthosScore: 0,
            nftName: `#${listing.tokenId.toString()}`,
            nftCollection: 'Unknown',
            nftImage: '',
            floorPrice: 0,
          };
        }
      })
    );

    console.log(`[Marketplace API] Found ${enrichedListings.length} listings`);

    return NextResponse.json({
      success: true,
      listings: enrichedListings,
      count: enrichedListings.length,
    });
  } catch (error) {
    console.error('[Marketplace API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
      { status: 500 }
    );
  }
}
