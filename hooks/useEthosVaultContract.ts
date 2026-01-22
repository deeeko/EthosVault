/**
 * EthosVault Contract Hooks
 *
 * Complete set of wagmi/viem hooks for interacting with the EthosVault smart contract.
 * Handles all lending, borrowing, and reputation operations with proper error handling,
 * loading states, and transaction management.
 *
 * Flow Integration:
 * 1. Lender lists NFT → approve + listNFT
 * 2. Borrower requests loan → requestLoan with collateral
 * 3. Borrower repays → repay (gets collateral back, score boost)
 * 4. Liquidation → liquidate on default
 */

'use client';

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, usePublicClient } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { ETHOS_VAULT_CONTRACT, SUPPORTED_CHAIN } from '@/lib/contracts/config';
import { useState, useEffect } from 'react';

// ========================================
// READ HOOKS (View Functions)
// ========================================

/**
 * Get all NFT listings from the contract
 * @returns Array of listings with lender, nft address, tokenId, and availability
 */
export function useGetAllListings() {
  const { data, isLoading, isError, error, refetch } = useReadContract({
    ...ETHOS_VAULT_CONTRACT,
    functionName: 'getAllListings',
    query: {
      refetchInterval: 10000, // Refetch every 10 seconds
    },
  });

  return {
    listings: data || [],
    isLoading,
    isError,
    error,
    refetch,
  };
}

/**
 * Get a specific listing by ID
 * @param listingId - The listing ID to fetch
 */
export function useGetListing(listingId: bigint | undefined) {
  const { data, isLoading, isError, error } = useReadContract({
    ...ETHOS_VAULT_CONTRACT,
    functionName: 'listings',
    args: listingId !== undefined ? [listingId] : undefined,
    query: {
      enabled: listingId !== undefined,
    },
  });

  return {
    listing: data,
    isLoading,
    isError,
    error,
  };
}

/**
 * Get a specific loan by ID
 * @param loanId - The loan ID to fetch
 */
export function useGetLoan(loanId: bigint | undefined) {
  const { data, isLoading, isError, error } = useReadContract({
    ...ETHOS_VAULT_CONTRACT,
    functionName: 'loans',
    args: loanId !== undefined ? [loanId] : undefined,
    query: {
      enabled: loanId !== undefined,
    },
  });

  return {
    loan: data,
    isLoading,
    isError,
    error,
  };
}

/**
 * Calculate required collateral in basis points from Ethos score
 * @param ethosScore - The user's Ethos score (0-2800)
 * @returns Collateral requirement in basis points
 */
export function useCalculateCollateral(ethosScore: number | undefined) {
  const { data, isLoading, isError, error } = useReadContract({
    ...ETHOS_VAULT_CONTRACT,
    functionName: 'collateralBpsFromScore',
    args: ethosScore !== undefined ? [BigInt(ethosScore)] : undefined,
    query: {
      enabled: ethosScore !== undefined,
    },
  });

  return {
    collateralBps: data,
    isLoading,
    isError,
    error,
  };
}

/**
 * Get listing counter (total number of listings)
 */
export function useListingCounter() {
  const { data, isLoading, isError, error } = useReadContract({
    ...ETHOS_VAULT_CONTRACT,
    functionName: 'listingCounter',
  });

  return {
    counter: data,
    isLoading,
    isError,
    error,
  };
}

/**
 * Get loan counter (total number of loans)
 */
export function useLoanCounter() {
  const { data, isLoading, isError, error } = useReadContract({
    ...ETHOS_VAULT_CONTRACT,
    functionName: 'loanCounter',
  });

  return {
    counter: data,
    isLoading,
    isError,
    error,
  };
}

// ========================================
// WRITE HOOKS (State-Changing Functions)
// ========================================

/**
 * List an NFT for lending
 * Flow: Lender must first approve the contract, then call this function
 *
 * @param onSuccess - Callback on successful transaction
 * @param onError - Callback on error
 */
export function useListNFT(onSuccess?: () => void, onError?: (error: Error) => void) {
  const { writeContractAsync, data: hash, isPending, isError, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const listNFT = async (nftAddress: `0x${string}`, tokenId: bigint) => {
    try {
      const txHash = await writeContractAsync({
        ...ETHOS_VAULT_CONTRACT,
        functionName: 'listNFT',
        args: [nftAddress, tokenId],
      });
      return txHash;
    } catch (err) {
      onError?.(err as Error);
      throw err;
    }
  };

  useEffect(() => {
    if (isSuccess && onSuccess) {
      onSuccess();
    }
  }, [isSuccess, onSuccess]);

  return {
    listNFT,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    isError,
    error,
  };
}

/**
 * Request a loan for a listed NFT
 * Flow: Borrower calls this with collateral payment
 *
 * @param onSuccess - Callback on successful transaction
 * @param onError - Callback on error
 */
export function useRequestLoan(onSuccess?: () => void, onError?: (error: Error) => void) {
  const { writeContractAsync, data: hash, isPending, isError, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const requestLoan = async (
    listingId: bigint,
    ethosScore: number,
    floorPrice: bigint,
    collateralAmount: bigint
  ) => {
    try {
      const txHash = await writeContractAsync({
        ...ETHOS_VAULT_CONTRACT,
        functionName: 'requestLoan',
        args: [listingId, BigInt(ethosScore), floorPrice],
        value: collateralAmount, // Send ETH as collateral
      });
      return txHash;
    } catch (err) {
      onError?.(err as Error);
      throw err;
    }
  };

  useEffect(() => {
    if (isSuccess && onSuccess) {
      onSuccess();
    }
  }, [isSuccess, onSuccess]);

  return {
    requestLoan,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    isError,
    error,
  };
}

/**
 * Repay a loan and return the NFT wrapper
 * Flow: Borrower calls this to return NFT, get collateral back, and boost score
 *
 * @param onSuccess - Callback on successful transaction
 * @param onError - Callback on error
 */
export function useRepayLoan(onSuccess?: () => void, onError?: (error: Error) => void) {
  const { writeContractAsync, data: hash, isPending, isError, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const repayLoan = async (loanId: bigint) => {
    try {
      const txHash = await writeContractAsync({
        ...ETHOS_VAULT_CONTRACT,
        functionName: 'repay',
        args: [loanId],
      });
      return txHash;
    } catch (err) {
      onError?.(err as Error);
      throw err;
    }
  };

  useEffect(() => {
    if (isSuccess && onSuccess) {
      onSuccess();
    }
  }, [isSuccess, onSuccess]);

  return {
    repayLoan,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    isError,
    error,
  };
}

/**
 * Liquidate a defaulted loan
 * Flow: Lender calls this when borrower defaults
 *
 * @param onSuccess - Callback on successful transaction
 * @param onError - Callback on error
 */
export function useLiquidateLoan(onSuccess?: () => void, onError?: (error: Error) => void) {
  const { writeContractAsync, data: hash, isPending, isError, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const liquidate = async (loanId: bigint) => {
    try {
      const txHash = await writeContractAsync({
        ...ETHOS_VAULT_CONTRACT,
        functionName: 'liquidate',
        args: [loanId],
      });
      return txHash;
    } catch (err) {
      onError?.(err as Error);
      throw err;
    }
  };

  useEffect(() => {
    if (isSuccess && onSuccess) {
      onSuccess();
    }
  }, [isSuccess, onSuccess]);

  return {
    liquidate,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    isError,
    error,
  };
}

// ========================================
// HELPER HOOKS
// ========================================

/**
 * Calculate collateral amount in ETH based on floor price and Ethos score
 * @param floorPriceEth - NFT floor price in ETH
 * @param ethosScore - User's Ethos score
 */
export function useCalculateCollateralAmount(floorPriceEth: number | undefined, ethosScore: number | undefined) {
  const { collateralBps, isLoading, isError } = useCalculateCollateral(ethosScore);

  const [collateralAmount, setCollateralAmount] = useState<bigint | undefined>();
  const [collateralEth, setCollateralEth] = useState<string>('0');

  useEffect(() => {
    if (floorPriceEth && collateralBps) {
      // Formula: collateral = floorPrice * (collateralBps / 10000)
      // collateralBps is in basis points (1 bps = 0.01%)
      const floorPriceWei = parseEther(floorPriceEth.toString());
      const collateral = (floorPriceWei * collateralBps) / BigInt(10000);
      setCollateralAmount(collateral);
      setCollateralEth(formatEther(collateral));
    }
  }, [floorPriceEth, collateralBps]);

  return {
    collateralAmount,
    collateralEth,
    collateralBps,
    isLoading,
    isError,
  };
}

/**
 * Check if wallet is connected to the correct network
 */
export function useCorrectNetwork() {
  const { chain } = useAccount();
  const isCorrectNetwork = chain?.id === SUPPORTED_CHAIN.id;

  return {
    isCorrectNetwork,
    currentChain: chain,
    expectedChain: SUPPORTED_CHAIN,
  };
}
