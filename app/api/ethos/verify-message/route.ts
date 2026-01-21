import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json();

    if (!address) {
      return NextResponse.json({ error: 'Address required' }, { status: 400 });
    }

    const timestamp = new Date().toISOString();
    const message = `Welcome to EthosVault!

Sign this message to verify your Ethos Network profile and link it to your wallet.

Wallet Address: ${address}
Timestamp: ${timestamp}

This signature will not trigger any blockchain transaction or cost gas fees.`;

    return NextResponse.json({ message, timestamp });
  } catch (error) {
    console.error('Verify message error:', error);
    return NextResponse.json({ error: 'Failed to create message' }, { status: 500 });
  }
}