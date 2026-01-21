import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

function calculateLevel(score: number): string {
  if (score >= 2400) return 'Revered';
  if (score >= 2000) return 'Exemplary';
  if (score >= 1600) return 'Reputable';
  if (score >= 1200) return 'Neutral';
  if (score >= 800) return 'Questionable';
  return 'Untrusted';
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json({ error: 'Address required' }, { status: 400 });
    }

    const session = await getSession();

    // Check if user has verified their Ethos profile
    if (session.ethosVerified !== address.toLowerCase()) {
      return NextResponse.json(
        { 
          error: 'Ethos profile not verified',
          score: 0,
          level: 'Unverified'
        }, 
        { status: 200 }
      );
    }

    // TODO: Replace with real Ethos Network API call
    // For now, generate a consistent mock score based on address
    const addressNum = parseInt(address.slice(2, 10), 16);
    const mockScore = 800 + (addressNum % 2000); // Range: 800-2800

    const level = calculateLevel(mockScore);

    return NextResponse.json({
      score: mockScore,
      level,
      address,
      verified: true,
      profileUrl: `https://ethos.network/profile/${address}`,
    });

  } catch (error) {
    console.error('Ethos score fetch error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch score',
        score: 0,
        level: 'Unverified'
      }, 
      { status: 500 }
    );
  }
}