/**
 * Hooks Index
 *
 * Central export point for all contract hooks.
 * Import hooks from this file in your components.
 */

// Contract interaction hooks
export {
  useGetAllListings,
  useGetListing,
  useGetLoan,
  useCalculateCollateral,
  useListingCounter,
  useLoanCounter,
  useListNFT,
  useRequestLoan,
  useRepayLoan,
  useLiquidateLoan,
  useCalculateCollateralAmount,
  useCorrectNetwork,
} from './useEthosVaultContract';

// NFT approval hooks
export {
  useIsNFTApproved,
  useIsApprovedForAll,
  useApproveNFT,
  useSetApprovalForAll,
  useNFTApprovalFlow,
} from './useNFTApproval';

// Event listener hooks
export {
  useWatchNFTListed,
  useWatchLoanRequested,
  useWatchLoanRepaid,
  useWatchLoanLiquidated,
  useWatchUserActivity,
} from './useContractEvents';

// Event type exports
export type {
  NFTListedEvent,
  LoanRequestedEvent,
  LoanRepaidEvent,
  LoanLiquidatedEvent,
} from './useContractEvents';
