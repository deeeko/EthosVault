/**
 * GET /api/profile/activity
 *
 * Fetches user's lending/borrowing activity from contract events
 * Authenticated endpoint
 */

import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getContractEvents } from '@/lib/contractServer';

export async function GET() {
  try {
    const session = await getSession();

    if (!session.isAuthenticated || !session.address) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    console.log('[Profile API] Fetching activity for:', session.address);

    // Fetch all relevant events for the user
    const [nftListedEvents, loanRequestedEvents, loanRepaidEvents, liquidatedEvents] =
      await Promise.all([
        getContractEvents('NFTListed'),
        getContractEvents('LoanRequested'),
        getContractEvents('LoanRepaid'),
        getContractEvents('LoanLiquidated'),
      ]);

    // Filter events for this user
    const userAddress = session.address.toLowerCase();

    const userListings = nftListedEvents.filter(
      (event: any) => event.args.lender?.toLowerCase() === userAddress
    );

    const userBorrows = loanRequestedEvents.filter(
      (event: any) => event.args.borrower?.toLowerCase() === userAddress
    );

    const userRepayments = loanRepaidEvents.filter(
      (event: any) => event.args.borrower?.toLowerCase() === userAddress
    );

    const userLiquidations = liquidatedEvents.filter(
      (event: any) => event.args.lender?.toLowerCase() === userAddress
    );

    const activity = [
      ...userListings.map((e: any) => ({
        type: 'listed',
        timestamp: e.blockNumber,
        nft: e.args.nft,
        tokenId: e.args.tokenId?.toString(),
        listingId: e.args.listingId?.toString(),
      })),
      ...userBorrows.map((e: any) => ({
        type: 'borrowed',
        timestamp: e.blockNumber,
        loanId: e.args.loanId?.toString(),
        listingId: e.args.listingId?.toString(),
        collateral: e.args.collateral?.toString(),
      })),
      ...userRepayments.map((e: any) => ({
        type: 'repaid',
        timestamp: e.blockNumber,
        loanId: e.args.loanId?.toString(),
      })),
      ...userLiquidations.map((e: any) => ({
        type: 'liquidated',
        timestamp: e.blockNumber,
        loanId: e.args.loanId?.toString(),
      })),
    ];

    // Sort by timestamp (block number) descending
    activity.sort((a, b) => Number(b.timestamp) - Number(a.timestamp));

    console.log(`[Profile API] Found ${activity.length} activities`);

    return NextResponse.json({
      success: true,
      address: session.address,
      ethosScore: session.ethosScore || 0,
      activity,
      stats: {
        totalListings: userListings.length,
        totalBorrows: userBorrows.length,
        totalRepayments: userRepayments.length,
        totalLiquidations: userLiquidations.length,
      },
    });
  } catch (error) {
    console.error('[Profile API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activity' },
      { status: 500 }
    );
  }
}
