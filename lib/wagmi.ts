'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, baseSepolia } from 'wagmi/chains';
import { http } from 'wagmi';

// Ensure project ID is set - using the one from .env.local
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '0c3e872b65f2fc8f860f94b6dd9fbba9';

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
