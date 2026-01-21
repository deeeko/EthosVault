'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, baseSepolia } from 'wagmi/chains';
import { http } from 'wagmi';

// Ensure project ID is set - using the one from .env.local
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '78e63f12583d64b6e0fef5b2de04bf71';

if (!projectId || projectId === '') {
  console.warn('⚠️ WalletConnect Project ID is missing! Get one at https://cloud.walletconnect.com');
}

export const config = getDefaultConfig({
  appName: 'EthosVault',
  projectId,
  chains: [base, baseSepolia],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
  ssr: true,
});
