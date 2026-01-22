import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function GET() {
  try {
    const session = await getSession();

    if (!session.isAuthenticated) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    return NextResponse.json({
      address: session.address,
      chainId: session.chainId,
      isAuthenticated: true,
      ethosScore: session.ethosScore || 0,
      ethosProfileId: session.ethosProfileId || 0,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Session error' }, { status: 500 });
  }
}
