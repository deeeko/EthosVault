import { getIronSession, IronSession } from 'iron-session';
import { cookies } from 'next/headers';

export interface SessionData {
  nonce?: string;
  address?: string;
  chainId?: number;
  isAuthenticated?: boolean;
  isLoggedIn?: boolean;
  ethosVerified?: string;
  ethosScore?: number;
  ethosProfileId?: number;
  siwe?: {
    address: string;
    chainId: number;
  };
}

const sessionOptions = {
  password: process.env.SESSION_SECRET || 'complex_password_at_least_32_characters_long_for_production_use_only',
  cookieName: 'ethosvault_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7, // 1 week
  },
};

export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}

export async function destroySession() {
  const session = await getSession();
  session.destroy();
}
