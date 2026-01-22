/**
 * Type-Safe Contract Interfaces
 *
 * Generated TypeScript types from the EthosVault ABI using abitype.
 * Provides full type safety for contract interactions.
 */

import { ETHOS_VAULT_ABI } from '../abis/ethosVault';
import type { Abi } from 'viem';

// Export the ABI with proper typing
export type EthosVaultABI = typeof ETHOS_VAULT_ABI;

// ========================================
// STRUCT TYPES (from contract)
// ========================================

/**
 * Listing struct from the contract
 */
export interface ContractListing {
  lender: `0x${string}`;
  nft: `0x${string}`;
  tokenId: bigint;
  available: boolean;
}

/**
 * Loan struct from the contract
 */
export interface ContractLoan {
  lender: `0x${string}`;
  borrower: `0x${string}`;
  nft: `0x${string}`;
  tokenId: bigint;
  floorPrice: bigint;
  collateral: bigint;
  active: boolean;
}

// ========================================
// FUNCTION PARAMETER TYPES
// ========================================

/**
 * Parameters for listNFT function
 */
export interface ListNFTParams {
  nft: `0x${string}`;
  tokenId: bigint;
}

/**
 * Parameters for requestLoan function
 */
export interface RequestLoanParams {
  listingId: bigint;
  ethosScore: bigint;
  floorPrice: bigint;
  collateralValue: bigint; // ETH to send
}

/**
 * Parameters for repay function
 */
export interface RepayLoanParams {
  loanId: bigint;
}

/**
 * Parameters for liquidate function
 */
export interface LiquidateLoanParams {
  loanId: bigint;
}

// ========================================
// EVENT TYPES
// ========================================

/**
 * NFTListed event
 */
export interface NFTListedEvent {
  listingId: bigint;
  lender: `0x${string}`;
  nft: `0x${string}`;
  tokenId: bigint;
}

/**
 * LoanRequested event
 */
export interface LoanRequestedEvent {
  loanId: bigint;
  listingId: bigint;
  borrower: `0x${string}`;
  collateral: bigint;
}

/**
 * LoanRepaid event
 */
export interface LoanRepaidEvent {
  loanId: bigint;
  borrower: `0x${string}`;
}

/**
 * LoanLiquidated event
 */
export interface LoanLiquidatedEvent {
  loanId: bigint;
  lender: `0x${string}`;
}

// ========================================
// UTILITY TYPES
// ========================================

/**
 * Contract read function names
 */
export type ReadFunctionName =
  | 'getAllListings'
  | 'listings'
  | 'loans'
  | 'collateralBpsFromScore'
  | 'listingCounter'
  | 'loanCounter'
  | 'balanceOf'
  | 'getApproved'
  | 'isApprovedForAll'
  | 'ownerOf'
  | 'name'
  | 'symbol'
  | 'tokenURI'
  | 'supportsInterface';

/**
 * Contract write function names
 */
export type WriteFunctionName =
  | 'listNFT'
  | 'requestLoan'
  | 'repay'
  | 'liquidate'
  | 'approve'
  | 'setApprovalForAll'
  | 'transferFrom'
  | 'safeTransferFrom';

/**
 * Contract event names
 */
export type EventName =
  | 'NFTListed'
  | 'LoanRequested'
  | 'LoanRepaid'
  | 'LoanLiquidated'
  | 'Approval'
  | 'ApprovalForAll'
  | 'Transfer';

// ========================================
// ERROR TYPES
// ========================================

/**
 * Contract custom errors
 */
export type ContractError =
  | 'ERC721IncorrectOwner'
  | 'ERC721InsufficientApproval'
  | 'ERC721InvalidApprover'
  | 'ERC721InvalidOperator'
  | 'ERC721InvalidOwner'
  | 'ERC721InvalidReceiver'
  | 'ERC721InvalidSender'
  | 'ERC721NonexistentToken';

/**
 * Parsed contract error with details
 */
export interface ParsedContractError {
  name: ContractError;
  message: string;
  args?: Record<string, any>;
}

// ========================================
// TRANSACTION STATUS TYPES
// ========================================

/**
 * Transaction status for UI feedback
 */
export type TransactionStatus = 'idle' | 'preparing' | 'pending' | 'confirming' | 'success' | 'error';

/**
 * Transaction state for hooks
 */
export interface TransactionState {
  status: TransactionStatus;
  hash?: `0x${string}`;
  error?: Error;
}

// ========================================
// COLLATERAL CALCULATION TYPES
// ========================================

/**
 * Collateral calculation result
 */
export interface CollateralCalculation {
  collateralBps: bigint;
  collateralAmount: bigint;
  collateralEth: string;
  floorPrice: bigint;
  ethosScore: number;
}

// ========================================
// HELPER TYPE GUARDS
// ========================================

/**
 * Type guard to check if an address is valid
 */
export function isValidAddress(address: string | undefined): address is `0x${string}` {
  return !!address && address.startsWith('0x') && address.length === 42;
}

/**
 * Type guard to check if a value is a valid BigInt
 */
export function isValidBigInt(value: any): value is bigint {
  return typeof value === 'bigint';
}

/**
 * Convert string to BigInt safely
 */
export function toBigInt(value: string | number | bigint): bigint {
  if (typeof value === 'bigint') return value;
  return BigInt(value);
}

/**
 * Format address for display (0x1234...5678)
 */
export function formatAddress(address: `0x${string}` | undefined, chars: number = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

// ========================================
// CONTRACT INTERACTION HELPERS
// ========================================

/**
 * Standard gas limits for different operations
 */
export const GAS_LIMITS = {
  APPROVE: 100000n,
  LIST_NFT: 200000n,
  REQUEST_LOAN: 300000n,
  REPAY_LOAN: 200000n,
  LIQUIDATE: 200000n,
} as const;

/**
 * Error messages for common failures
 */
export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: 'Please connect your wallet to continue',
  WRONG_NETWORK: 'Please switch to Base network',
  INSUFFICIENT_FUNDS: 'Insufficient funds for this transaction',
  NFT_NOT_APPROVED: 'Please approve the NFT first',
  TRANSACTION_REJECTED: 'Transaction was rejected',
  UNKNOWN_ERROR: 'An unexpected error occurred',
} as const;
