import { NextRequest, NextResponse } from 'next/server';
import { SiweMessage } from 'siwe';
import { getSession } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const { message, signature } = await request.json();

    if (!message || !signature) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    const session = await getSession();
    const siweMessage = new SiweMessage(message);
    const fields = await siweMessage.verify({ signature });

    if (fields.data.nonce !== session.nonce) {
      return NextResponse.json({ error: 'Invalid nonce' }, { status: 401 });
    }

    if (fields.data.expirationTime && new Date(fields.data.expirationTime) < new Date()) {
      return NextResponse.json({ error: 'Expired' }, { status: 401 });
    }

    session.address = fields.data.address;
    session.chainId = fields.data.chainId;
    session.isAuthenticated = true;
    delete session.nonce;
    await session.save();

    return NextResponse.json({ success: true, address: fields.data.address });

  } catch (error: any) {
    console.error('Verify error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 401 });
  }
}