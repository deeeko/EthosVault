'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, baseSepolia } from 'wagmi/chains';
import { http } from 'wagmi';

// Ensure project ID is set - using the one from .env.local
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '0c3e872b65f2fc8f860f94b6dd9fbba9';

if (!projectId || projectId === '') {
  console.warn('⚠️ WalletConnect Project ID is missing! Get one at https://cloud.walletconnect.com');
}

// Alchemy RPC URLs
const alchemyBaseSepoliaRpc = process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL;
const alchemyBaseMainnetRpc = process.env.NEXT_PUBLIC_ALCHEMY_BASE_MAINNET_RPC;

// Determine which chain we're using based on NEXT_PUBLIC_CHAIN_ID
const chainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '8453');
const isTestnet = chainId === 84532; // Base Sepolia

export const config = getDefaultConfig({
  appName: 'EthosVault',
  projectId,
  chains: [base, baseSepolia],
  transports: {
    // Use Alchemy RPC if available, otherwise fallback to default
    [base.id]: alchemyBaseMainnetRpc ? http(alchemyBaseMainnetRpc) : http(),
    [baseSepolia.id]: alchemyBaseSepoliaRpc ? http(alchemyBaseSepoliaRpc) : http(),
  },
  ssr: true,
});

// Log which RPC we're using
if (typeof window !== 'undefined') {
  console.log('🔗 Network:', isTestnet ? 'Base Sepolia Testnet' : 'Base Mainnet');
  console.log('🔗 RPC Provider:', alchemyBaseSepoliaRpc || alchemyBaseMainnetRpc ? 'Alchemy' : 'Default');
}
