import { NextRequest, NextResponse } from 'next/server';
import { SiweMessage } from 'siwe';
import { getSession } from '@/lib/session';
import { fetchEthosProfileServer } from '@/lib/ethosApiServer';

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

    // Fetch Ethos profile and score
    const ethosResponse = await fetchEthosProfileServer(fields.data.address);
    const ethosScore = ethosResponse.profile?.score || 0;
    const ethosProfileId = ethosResponse.profile?.profileId || 0;

    console.log('[Auth] User authenticated:', {
      address: fields.data.address,
      ethosScore,
      ethosProfileId,
    });

    session.address = fields.data.address;
    session.chainId = fields.data.chainId;
    session.isAuthenticated = true;
    session.ethosScore = ethosScore;
    session.ethosProfileId = ethosProfileId;
    delete session.nonce;
    await session.save();

    return NextResponse.json({
      success: true,
      address: fields.data.address,
      ethosScore,
      ethosProfileId,
    });

  } catch (error: any) {
    console.error('Verify error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 401 });
  }
}