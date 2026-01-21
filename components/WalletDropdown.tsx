'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, User, LogOut, Copy, ExternalLink, Check } from 'lucide-react';
import { useAccount, useDisconnect } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useEthos } from '@/hooks/useEthos';
import { useState } from 'react';
import { formatAddress } from '@/lib/utils';

interface WalletDropdownProps {
  onClose: () => void;
}

export function WalletDropdown({ onClose }: WalletDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();
  const { ethosProfile } = useEthos();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleConnect = () => {
    if (openConnectModal) {
      openConnectModal();
      onClose();
    }
  };

  const handleCopyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    onClose();
  };

  const handleViewOnExplorer = () => {
    if (address) {
      window.open(`https://basescan.org/address/${address}`, '_blank');
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={dropdownRef}
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] max-w-[288px] sm:max-w-[320px] card p-0 overflow-hidden shadow-xl"
        style={{ boxShadow: '0 0 30px rgba(212, 175, 55, 0.15)' }}
      >
        {!isConnected ? (
          /* Not Connected - Show Connect Button */
          <div className="p-4 sm:p-6">
            <div className="text-center mb-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-gold/20 to-gold-dark/20 flex items-center justify-center">
                <Wallet size={28} className="text-gold" />
              </div>
              <h3 className="font-semibold text-lg sm:text-xl mb-1">Connect Wallet</h3>
              <p className="text-xs sm:text-sm text-dark-muted">
                Connect your wallet to start lending or borrowing NFTs
              </p>
            </div>

            <button
              onClick={handleConnect}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3"
            >
              <Wallet size={18} />
              <span>Connect Wallet</span>
            </button>

            <p className="text-xs text-dark-muted text-center mt-4">
              By connecting, you agree to our Terms of Service
            </p>
          </div>
        ) : (
          /* Connected - Show Wallet Info */
          <>
            {/* User Info Section */}
            <div className="p-4 sm:p-6 border-b border-dark-border bg-gradient-to-br from-gold/5 to-transparent">
              <div className="flex items-center gap-3 mb-4">
                {/* Avatar */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center flex-shrink-0">
                  <User size={28} className="text-dark-bg" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Wallet size={14} className="text-gold flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-dark-muted">Connected</span>
                  </div>
                  <p className="font-semibold text-base sm:text-lg text-dark-text truncate">
                    {formatAddress(address || '')}
                  </p>
                </div>
              </div>

              {/* Ethos Score */}
              {ethosProfile && (
                <div className="flex items-center justify-between p-3 rounded-lg bg-dark-card border border-dark-border">
                  <span className="text-xs sm:text-sm text-dark-muted">Ethos Score</span>
                  <span className="text-lg sm:text-xl font-bold text-gold">
                    {ethosProfile.score}
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-2">
              {/* Copy Address */}
              <button
                onClick={handleCopyAddress}
                className="w-full flex items-center gap-3 p-3 rounded-lg text-left hover:bg-dark-card transition-colors text-xs sm:text-sm"
              >
                {copied ? (
                  <Check size={18} className="text-ethos-exemplary flex-shrink-0" />
                ) : (
                  <Copy size={18} className="text-dark-muted flex-shrink-0" />
                )}
                <span className="text-dark-text">
                  {copied ? 'Address Copied!' : 'Copy Address'}
                </span>
              </button>

              {/* View on Explorer */}
              <button
                onClick={handleViewOnExplorer}
                className="w-full flex items-center gap-3 p-3 rounded-lg text-left hover:bg-dark-card transition-colors text-xs sm:text-sm"
              >
                <ExternalLink size={18} className="text-dark-muted flex-shrink-0" />
                <span className="text-dark-text">View on Explorer</span>
              </button>

              {/* Disconnect */}
              <button
                onClick={handleDisconnect}
                className="w-full flex items-center gap-3 p-3 rounded-lg text-left hover:bg-ethos-untrusted/10 transition-colors text-xs sm:text-sm group"
              >
                <LogOut size={18} className="text-ethos-untrusted flex-shrink-0" />
                <span className="text-ethos-untrusted group-hover:text-ethos-untrusted/80">
                  Disconnect
                </span>
              </button>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
