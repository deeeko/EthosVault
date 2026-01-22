/**
 * Contract Integration Index
 *
 * Central export point for all contract-related functionality.
 * Import from this file to access ABIs, configs, types, and utilities.
 */

// ABI exports
export { ETHOS_VAULT_ABI } from '../abis/ethosVault';

// Configuration exports
export {
  ETHOS_VAULT_ADDRESS,
  ETHOS_VAULT_CONTRACT,
  SUPPORTED_CHAIN,
} from './config';

// Type exports
export type {
  EthosVaultABI,
  ContractListing,
  ContractLoan,
  ListNFTParams,
  RequestLoanParams,
  RepayLoanParams,
  LiquidateLoanParams,
  NFTListedEvent,
  LoanRequestedEvent,
  LoanRepaidEvent,
  LoanLiquidatedEvent,
  ReadFunctionName,
  WriteFunctionName,
  EventName,
  ContractError,
  ParsedContractError,
  TransactionStatus,
  TransactionState,
  CollateralCalculation,
} from './types';

export {
  isValidAddress,
  isValidBigInt,
  toBigInt,
  formatAddress,
  GAS_LIMITS,
  ERROR_MESSAGES,
} from './types';
