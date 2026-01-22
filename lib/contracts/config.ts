/**
 * Contract Configuration for EthosVault
 *
 * Centralized contract address and chain configuration.
 * This file exports constants used across all contract hooks.
 */

import { base, baseSepolia } from 'wagmi/chains';
import { ETHOS_VAULT_ABI } from '../abis/ethosVault';

// Contract address from environment variables
export const ETHOS_VAULT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000') as `0x${string}`;

// Chain ID from environment (defaults to Base mainnet)
const CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '8453');

// Chain configuration
export const SUPPORTED_CHAIN = CHAIN_ID === 84532 ? baseSepolia : base;

// Contract configuration object for wagmi/viem
export const ETHOS_VAULT_CONTRACT = {
  address: ETHOS_VAULT_ADDRESS,
  abi: ETHOS_VAULT_ABI,
  chainId: SUPPORTED_CHAIN.id,
} as const;

// Validation
if (!process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || ETHOS_VAULT_ADDRESS === '0x0000000000000000000000000000000000000000') {
  console.warn('⚠️ NEXT_PUBLIC_CONTRACT_ADDRESS not set in environment variables. Contract interactions will fail.');
}
