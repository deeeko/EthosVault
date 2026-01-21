'use client';

import { useState, useEffect } from 'react';
import { useAccount, useSignMessage } from 'wagmi';

interface EthosProfile {
  score: number;
  level: string;
  isVerified: boolean;
}

export function useEthosProfile() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  
  const [ethosScore, setEthosScore] = useState<number | null>(null);
  const [ethosLevel, setEthosLevel] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isConnected || !address) {
      setEthosScore(null);
      setEthosLevel(null);
      setIsVerified(false);
      return;
    }

    const checkEthosProfile = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const verifyCheck = await fetch('/api/ethos/verify-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address }),
        });

        if (verifyCheck.ok) {
          const { verified } = await verifyCheck.json();
          setIsVerified(verified);

          if (verified) {
            await fetchEthosScore();
          }
        }
      } catch (err) {
        console.error('Ethos check error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkEthosProfile();
  }, [address, isConnected]);

  const fetchEthosScore = async () => {
    if (!address) return;

    try {
      const response = await fetch(`/api/ethos/score?address=${address}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch Ethos score');
      }

      const data = await response.json();
      setEthosScore(data.score || 0);
      setEthosLevel(data.level || 'Unverified');
    } catch (err) {
      console.error('Score fetch error:', err);
      setError('Failed to load Ethos score');
    }
  };

  const verifyEthos = async () => {
    if (!address || !isConnected) {
      setError('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const nonceRes = await fetch('/api/ethos/verify-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      });

      if (!nonceRes.ok) {
        throw new Error('Failed to get verification message');
      }

      const { message } = await nonceRes.json();

      const signature = await signMessageAsync({ message });

      const verifyRes = await fetch('/api/ethos/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          message,
          signature,
        }),
      });

      if (!verifyRes.ok) {
        const errorData = await verifyRes.json();
        throw new Error(errorData.error || 'Verification failed');
      }

      setIsVerified(true);
      await fetchEthosScore();

    } catch (err: any) {
      console.error('Ethos verification error:', err);
      
      if (err.message?.includes('User rejected')) {
        setError('Signature rejected. Please try again.');
      } else {
        setError(err.message || 'Verification failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    ethosScore,
    ethosLevel,
    isLoading,
    isVerified,
    error,
    verifyEthos,
    refetch: fetchEthosScore,
  };
}