'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { fetchEthosProfileByAddress, fetchEthosProfileSingleAddress, EthosProfile, getEthosVerifyUrl } from '@/lib/ethosApi';

interface UseEthosReturn {
  ethosProfile: EthosProfile | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  connectEthos: () => void;
}

export function useEthos(): UseEthosReturn {
  const { address, isConnected } = useAccount();
  const [ethosProfile, setEthosProfile] = useState<EthosProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!address || !isConnected) {
      setEthosProfile(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🔄 Fetching Ethos profile for connected wallet:', address);

      // Try primary API endpoint first
      let result = await fetchEthosProfileByAddress(address);

      // If primary fails, try alternative endpoint
      if (!result.success || !result.profile) {
        console.log('🔄 Trying alternative API endpoint...');
        result = await fetchEthosProfileSingleAddress(address);
      }

      if (result.success && result.profile) {
        console.log('✅ Ethos profile loaded successfully');
        setEthosProfile(result.profile);
        setError(null);
      } else {
        console.log('ℹ️ No Ethos profile found for this wallet');
        setEthosProfile(null);
        setError(result.error || 'No profile found');
      }
    } catch (err) {
      console.error('❌ Ethos fetch error:', err);
      setError('Failed to fetch Ethos profile');
      setEthosProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && address) {
      // Delay to avoid spamming API
      const timer = setTimeout(() => {
        fetchProfile();
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setEthosProfile(null);
      setError(null);
    }
  }, [address, isConnected]);

  const connectEthos = () => {
    if (!address) {
      alert('Please connect your wallet first');
      return;
    }

    const verifyUrl = getEthosVerifyUrl(
      address,
      `${window.location.origin}/profile`
    );

    console.log('🔗 Opening Ethos verification:', verifyUrl);
    window.open(verifyUrl, '_blank', 'noopener,noreferrer');
  };

  return {
    ethosProfile,
    loading,
    error,
    refetch: fetchProfile,
    connectEthos,
  };
}
