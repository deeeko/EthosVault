'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, baseSepolia } from 'wagmi/chains';
import { http } from 'viem';

// WalletConnect Project ID (required for RainbowKit)
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!projectId) {
  console.error('❌ WalletConnect Project ID is missing! Add NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID to .env.local');
}

// Alchemy RPC URLs (from .env.local)
const alchemySepolia = process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL;       // Base Sepolia
const alchemyMainnet = process.env.NEXT_PUBLIC_ALCHEMY_BASE_MAINNET_RPC; // Base Mainnet

// Determine chain from env (default to Base Mainnet if missing)
const chainIdEnv = process.env.NEXT_PUBLIC_CHAIN_ID || '8453';
const chainId = parseInt(chainIdEnv, 10);

const isTestnet = chainId === 84532;

// Select the active chain
const activeChain = isTestnet ? baseSepolia : base;

// Select the correct RPC URL
const activeRpc = isTestnet ? alchemySepolia : alchemyMainnet;

if (!activeRpc) {
  console.warn(
    `⚠️ No Alchemy RPC URL found for ${isTestnet ? 'Base Sepolia' : 'Base Mainnet'}. ` +
    `Using public fallback (may be slow/rate-limited). ` +
    `Add NEXT_PUBLIC_ALCHEMY_RPC_URL (or NEXT_PUBLIC_ALCHEMY_BASE_MAINNET_RPC) to .env.local`
  );
}

// Export the wagmi + RainbowKit config
export const config = getDefaultConfig({
  appName: 'EthosVault',
  projectId: projectId || '0c3e872b65f2fc8f860f94b6dd9fbba9', // fallback if missing
  chains: [activeChain], // only the active one to avoid confusion
  transports: {
    [activeChain.id]: activeRpc ? http(activeRpc) : http(),
  },
  ssr: true,
});

// Optional debug log (visible in browser console)
if (typeof window !== 'undefined') {
  console.log(
    `🔗 Connected to: ${isTestnet ? 'Base Sepolia (testnet)' : 'Base Mainnet'}`,
    `\n🔗 Chain ID: ${activeChain.id}`,
    `\n🔗 RPC: ${activeRpc ? 'Alchemy' : 'Public fallback'}`
  );
}