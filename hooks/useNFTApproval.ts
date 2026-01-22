/**
 * NFT Approval Hook
 *
 * Handles ERC-721 approval for the EthosVault contract.
 * Lenders must approve the contract before listing their NFTs.
 */

'use client';

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useEffect } from 'react';
import { ETHOS_VAULT_ADDRESS } from '@/lib/contracts/config';

// Standard ERC-721 ABI for approval functions
const ERC721_APPROVAL_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "getApproved",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "setApprovalForAll",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      }
    ],
    "name": "isApprovedForAll",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
] as const;

/**
 * Check if a specific NFT is approved for the EthosVault contract
 * @param nftAddress - The NFT contract address
 * @param tokenId - The token ID
 */
export function useIsNFTApproved(nftAddress: `0x${string}` | undefined, tokenId: bigint | undefined) {
  const { data: approvedAddress, isLoading, isError, error, refetch } = useReadContract({
    address: nftAddress,
    abi: ERC721_APPROVAL_ABI,
    functionName: 'getApproved',
    args: tokenId !== undefined ? [tokenId] : undefined,
    query: {
      enabled: !!nftAddress && tokenId !== undefined,
    },
  });

  const isApproved = approvedAddress?.toLowerCase() === ETHOS_VAULT_ADDRESS.toLowerCase();

  return {
    isApproved,
    approvedAddress,
    isLoading,
    isError,
    error,
    refetch,
  };
}

/**
 * Check if all NFTs from a collection are approved (operator approval)
 * @param nftAddress - The NFT contract address
 * @param ownerAddress - The owner's wallet address
 */
export function useIsApprovedForAll(
  nftAddress: `0x${string}` | undefined,
  ownerAddress: `0x${string}` | undefined
) {
  const { data: isApprovedForAll, isLoading, isError, error, refetch } = useReadContract({
    address: nftAddress,
    abi: ERC721_APPROVAL_ABI,
    functionName: 'isApprovedForAll',
    args: nftAddress && ownerAddress ? [ownerAddress, ETHOS_VAULT_ADDRESS] : undefined,
    query: {
      enabled: !!nftAddress && !!ownerAddress,
    },
  });

  return {
    isApprovedForAll: !!isApprovedForAll,
    isLoading,
    isError,
    error,
    refetch,
  };
}

/**
 * Approve a specific NFT for the EthosVault contract
 * @param onSuccess - Callback on successful approval
 * @param onError - Callback on error
 */
export function useApproveNFT(onSuccess?: () => void, onError?: (error: Error) => void) {
  const { writeContractAsync, data: hash, isPending, isError, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const approveNFT = async (nftAddress: `0x${string}`, tokenId: bigint) => {
    try {
      const txHash = await writeContractAsync({
        address: nftAddress,
        abi: ERC721_APPROVAL_ABI,
        functionName: 'approve',
        args: [ETHOS_VAULT_ADDRESS, tokenId],
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
    approveNFT,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    isError,
    error,
  };
}

/**
 * Approve all NFTs from a collection for the EthosVault contract
 * @param onSuccess - Callback on successful approval
 * @param onError - Callback on error
 */
export function useSetApprovalForAll(onSuccess?: () => void, onError?: (error: Error) => void) {
  const { writeContractAsync, data: hash, isPending, isError, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const setApprovalForAll = async (nftAddress: `0x${string}`, approved: boolean) => {
    try {
      const txHash = await writeContractAsync({
        address: nftAddress,
        abi: ERC721_APPROVAL_ABI,
        functionName: 'setApprovalForAll',
        args: [ETHOS_VAULT_ADDRESS, approved],
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
    setApprovalForAll,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    isError,
    error,
  };
}

/**
 * Combined hook for the full approval flow
 * Checks if approved, then approves if needed
 */
export function useNFTApprovalFlow(
  nftAddress: `0x${string}` | undefined,
  tokenId: bigint | undefined,
  onSuccess?: () => void,
  onError?: (error: Error) => void
) {
  const { isApproved, isLoading: checkingApproval, refetch } = useIsNFTApproved(nftAddress, tokenId);
  const { approveNFT, isPending, isConfirming, isSuccess, isError, error } = useApproveNFT(onSuccess, onError);

  const handleApproval = async () => {
    if (!nftAddress || tokenId === undefined) {
      throw new Error('NFT address and token ID are required');
    }

    // Refetch to ensure latest approval status
    const { data: approvedAddress } = await refetch();
    if (approvedAddress?.toLowerCase() === ETHOS_VAULT_ADDRESS.toLowerCase()) {
      // Already approved
      onSuccess?.();
      return null;
    }

    // Need to approve
    return approveNFT(nftAddress, tokenId);
  };

  return {
    isApproved,
    checkingApproval,
    handleApproval,
    isPending,
    isConfirming,
    isSuccess,
    isError,
    error,
  };
}
