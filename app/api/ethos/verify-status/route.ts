import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json();
    
    if (!address) {
      return NextResponse.json({ verified: false }, { status: 200 });
    }

    const session = await getSession();
    const verified = session.ethosVerified === address.toLowerCase();

    return NextResponse.json({ verified });
  } catch (error) {
    console.error('Verify status error:', error);
    return NextResponse.json({ verified: false }, { status: 200 });
  }
}