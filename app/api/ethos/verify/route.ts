import { NextRequest, NextResponse } from 'next/server';
import { verifyMessage } from 'viem';
import { getSession } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const { address, message, signature } = await request.json();

    if (!address || !message || !signature) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      );
    }

    const isValid = await verifyMessage({
      address: address as `0x${string}`,
      message,
      signature: signature as `0x${string}`,
    });

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid signature' }, 
        { status: 401 }
      );
    }

    const session = await getSession();
    session.ethosVerified = address.toLowerCase();
    await session.save();

    return NextResponse.json({ 
      success: true,
      message: 'Ethos profile verified successfully',
      address 
    });

  } catch (error: any) {
    console.error('Ethos verification error:', error);
    
    if (error.message?.includes('Signature')) {
      return NextResponse.json(
        { error: 'Invalid signature format' }, 
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Verification failed. Please try again.' }, 
      { status: 500 }
    );
  }
}