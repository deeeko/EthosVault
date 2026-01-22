/**
 * Contract Event Listeners
 *
 * Hooks for listening to EthosVault contract events in real-time.
 * Used for updating UI when listings are created, loans are requested/repaid, etc.
 */

'use client';

import { useWatchContractEvent } from 'wagmi';
import { ETHOS_VAULT_CONTRACT } from '@/lib/contracts/config';
import { useEffect, useState } from 'react';

// ========================================
// EVENT TYPES
// ========================================

export interface NFTListedEvent {
  listingId: bigint;
  lender: `0x${string}`;
  nft: `0x${string}`;
  tokenId: bigint;
}

export interface LoanRequestedEvent {
  loanId: bigint;
  listingId: bigint;
  borrower: `0x${string}`;
  collateral: bigint;
}

export interface LoanRepaidEvent {
  loanId: bigint;
  borrower: `0x${string}`;
}

export interface LoanLiquidatedEvent {
  loanId: bigint;
  lender: `0x${string}`;
}

// ========================================
// EVENT LISTENER HOOKS
// ========================================

/**
 * Listen for NFTListed events
 * Triggered when a lender lists an NFT
 */
export function useWatchNFTListed(onEvent?: (event: NFTListedEvent) => void) {
  const [events, setEvents] = useState<NFTListedEvent[]>([]);

  useWatchContractEvent({
    ...ETHOS_VAULT_CONTRACT,
    eventName: 'NFTListed',
    onLogs(logs) {
      const newEvents = logs.map((log) => ({
        listingId: log.args.listingId as bigint,
        lender: log.args.lender as `0x${string}`,
        nft: log.args.nft as `0x${string}`,
        tokenId: log.args.tokenId as bigint,
      }));

      setEvents((prev) => [...prev, ...newEvents]);
      newEvents.forEach((event) => onEvent?.(event));
    },
  });

  return { events };
}

/**
 * Listen for LoanRequested events
 * Triggered when a borrower requests a loan
 */
export function useWatchLoanRequested(onEvent?: (event: LoanRequestedEvent) => void) {
  const [events, setEvents] = useState<LoanRequestedEvent[]>([]);

  useWatchContractEvent({
    ...ETHOS_VAULT_CONTRACT,
    eventName: 'LoanRequested',
    onLogs(logs) {
      const newEvents = logs.map((log) => ({
        loanId: log.args.loanId as bigint,
        listingId: log.args.listingId as bigint,
        borrower: log.args.borrower as `0x${string}`,
        collateral: log.args.collateral as bigint,
      }));

      setEvents((prev) => [...prev, ...newEvents]);
      newEvents.forEach((event) => onEvent?.(event));
    },
  });

  return { events };
}

/**
 * Listen for LoanRepaid events
 * Triggered when a borrower repays a loan
 */
export function useWatchLoanRepaid(onEvent?: (event: LoanRepaidEvent) => void) {
  const [events, setEvents] = useState<LoanRepaidEvent[]>([]);

  useWatchContractEvent({
    ...ETHOS_VAULT_CONTRACT,
    eventName: 'LoanRepaid',
    onLogs(logs) {
      const newEvents = logs.map((log) => ({
        loanId: log.args.loanId as bigint,
        borrower: log.args.borrower as `0x${string}`,
      }));

      setEvents((prev) => [...prev, ...newEvents]);
      newEvents.forEach((event) => onEvent?.(event));
    },
  });

  return { events };
}

/**
 * Listen for LoanLiquidated events
 * Triggered when a lender liquidates a defaulted loan
 */
export function useWatchLoanLiquidated(onEvent?: (event: LoanLiquidatedEvent) => void) {
  const [events, setEvents] = useState<LoanLiquidatedEvent[]>([]);

  useWatchContractEvent({
    ...ETHOS_VAULT_CONTRACT,
    eventName: 'LoanLiquidated',
    onLogs(logs) {
      const newEvents = logs.map((log) => ({
        loanId: log.args.loanId as bigint,
        lender: log.args.lender as `0x${string}`,
      }));

      setEvents((prev) => [...prev, ...newEvents]);
      newEvents.forEach((event) => onEvent?.(event));
    },
  });

  return { events };
}

/**
 * Listen for all events for a specific user
 * Useful for profile/activity pages
 */
export function useWatchUserActivity(userAddress: `0x${string}` | undefined) {
  const [activity, setActivity] = useState<Array<{
    type: 'listed' | 'requested' | 'repaid' | 'liquidated';
    timestamp: Date;
    data: any;
  }>>([]);

  useWatchNFTListed((event) => {
    if (event.lender.toLowerCase() === userAddress?.toLowerCase()) {
      setActivity((prev) => [...prev, {
        type: 'listed',
        timestamp: new Date(),
        data: event,
      }]);
    }
  });

  useWatchLoanRequested((event) => {
    if (event.borrower.toLowerCase() === userAddress?.toLowerCase()) {
      setActivity((prev) => [...prev, {
        type: 'requested',
        timestamp: new Date(),
        data: event,
      }]);
    }
  });

  useWatchLoanRepaid((event) => {
    if (event.borrower.toLowerCase() === userAddress?.toLowerCase()) {
      setActivity((prev) => [...prev, {
        type: 'repaid',
        timestamp: new Date(),
        data: event,
      }]);
    }
  });

  useWatchLoanLiquidated((event) => {
    if (event.lender.toLowerCase() === userAddress?.toLowerCase()) {
      setActivity((prev) => [...prev, {
        type: 'liquidated',
        timestamp: new Date(),
        data: event,
      }]);
    }
  });

  return { activity };
}
