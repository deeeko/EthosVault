/**
 * Server-Side Contract Interaction Utilities
 *
 * Provides utilities for reading contract state from API routes
 * Uses viem for type-safe contract interactions
 */

import { createPublicClient, http, type Address, type PublicClient } from 'viem';
import { base, baseSepolia } from 'viem/chains';
import { ETHOS_VAULT_ABI } from './abis/ethosVault';

let _publicClient: PublicClient | null = null;
let _chainId: number | null = null;
let _contractAddress: Address | null = null;

/**
 * Get or create public client (lazy initialization)
 */
function getPublicClient(): PublicClient {
  if (_publicClient) return _publicClient;

  // Determine which chain we're on
  const chainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '8453');
  const isTestnet = chainId === 84532;

  // Select chain and RPC
  const chain = isTestnet ? baseSepolia : base;
  const rpcUrl = isTestnet
    ? process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL
    : process.env.NEXT_PUBLIC_ALCHEMY_BASE_MAINNET_RPC;

  _publicClient = createPublicClient({
    chain,
    transport: rpcUrl ? http(rpcUrl) : http(),
  });

  _chainId = chainId;

  return _publicClient;
}

/**
 * Get contract address from environment
 */
function getContractAddress(): Address {
  if (_contractAddress) return _contractAddress;

  const address = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';
  if (!address) {
    throw new Error('NEXT_PUBLIC_CONTRACT_ADDRESS environment variable not set');
  }

  _contractAddress = address as Address;
  return _contractAddress;
}

/**
 * Export chain info
 */
export function getChainId() {
  return parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '8453');
}

export function getChain() {
  const id = getChainId();
  return id === 84532 ? baseSepolia : base;
}

/**
 * Get all NFT listings from contract
 */
export async function getAllListingsFromContract() {
  try {
    const client = getPublicClient();
    const address = getContractAddress();

    const listings = await client.readContract({
      address,
      abi: ETHOS_VAULT_ABI,
      functionName: 'getAllListings',
    });

    return listings;
  } catch (error) {
    console.error('[Contract] Error fetching listings:', error);
    throw new Error('Failed to fetch listings from contract');
  }
}

/**
 * Get a specific listing by ID
 */
export async function getListingById(listingId: bigint) {
  try {
    const listing = await getPublicClient().readContract({
      address: getContractAddress(),
      abi: ETHOS_VAULT_ABI,
      functionName: 'listings',
      args: [listingId],
    });

    return listing;
  } catch (error) {
    console.error('[Contract] Error fetching listing:', error);
    throw new Error('Failed to fetch listing from contract');
  }
}

/**
 * Get a specific loan by ID
 */
export async function getLoanById(loanId: bigint) {
  try {
    const loan = await getPublicClient().readContract({
      address: getContractAddress(),
      abi: ETHOS_VAULT_ABI,
      functionName: 'loans',
      args: [loanId],
    });

    return loan;
  } catch (error) {
    console.error('[Contract] Error fetching loan:', error);
    throw new Error('Failed to fetch loan from contract');
  }
}

/**
 * Get listing counter (total number of listings)
 */
export async function getListingCounter() {
  try {
    const counter = await getPublicClient().readContract({
      address: getContractAddress(),
      abi: ETHOS_VAULT_ABI,
      functionName: 'listingCounter',
    });

    return counter;
  } catch (error) {
    console.error('[Contract] Error fetching listing counter:', error);
    return BigInt(0);
  }
}

/**
 * Get loan counter (total number of loans)
 */
export async function getLoanCounter() {
  try {
    const counter = await getPublicClient().readContract({
      address: getContractAddress(),
      abi: ETHOS_VAULT_ABI,
      functionName: 'loanCounter',
    });

    return counter;
  } catch (error) {
    console.error('[Contract] Error fetching loan counter:', error);
    return BigInt(0);
  }
}

/**
 * Calculate collateral requirement from score (matches contract logic)
 */
export async function calculateCollateralFromScore(score: bigint) {
  try {
    const bps = await getPublicClient().readContract({
      address: getContractAddress(),
      abi: ETHOS_VAULT_ABI,
      functionName: 'collateralBpsFromScore',
      args: [score],
    });

    return bps;
  } catch (error) {
    console.error('[Contract] Error calculating collateral:', error);
    throw new Error('Failed to calculate collateral');
  }
}

/**
 * Watch for contract events (used for activity tracking)
 */
export async function getContractEvents(eventName: string, fromBlock?: bigint) {
  try {
    const logs = await getPublicClient().getContractEvents({
      address: getContractAddress(),
      abi: ETHOS_VAULT_ABI,
      eventName: eventName as any,
      fromBlock: fromBlock || 'earliest',
      toBlock: 'latest',
    });

    return logs;
  } catch (error) {
    console.error('[Contract] Error fetching events:', error);
    return [];
  }
}
