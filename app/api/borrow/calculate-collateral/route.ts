/**
 * POST /api/borrow/calculate-collateral
 *
 * Calculates required collateral for a loan based on Ethos score and floor price
 * Authenticated endpoint
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { calculateCollateralBps, calculateCollateralAmount } from '@/lib/ethosApiServer';
import { parseEther } from 'viem';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session.isAuthenticated || !session.address) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { floorPriceEth } = await request.json();

    if (!floorPriceEth || isNaN(parseFloat(floorPriceEth))) {
      return NextResponse.json(
        { error: 'Invalid floor price' },
        { status: 400 }
      );
    }

    const ethosScore = session.ethosScore || 0;
    const floorPriceWei = parseEther(floorPriceEth.toString());

    // Calculate collateral
    const collateralBps = calculateCollateralBps(ethosScore);
    const collateralWei = calculateCollateralAmount(floorPriceWei, ethosScore);
    const collateralEth = Number(collateralWei) / 1e18;

    console.log('[Borrow API] Collateral calculated:', {
      address: session.address,
      ethosScore,
      floorPriceEth,
      collateralBps,
      collateralEth,
    });

    return NextResponse.json({
      success: true,
      ethosScore,
      floorPriceEth: parseFloat(floorPriceEth),
      collateralBps,
      collateralEth,
      collateralWei: collateralWei.toString(),
      collateralPercentage: collateralBps / 100,
    });
  } catch (error) {
    console.error('[Borrow API] Collateral calculation error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate collateral' },
      { status: 500 }
    );
  }
}
