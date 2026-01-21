'use client';

import { useState } from 'react';
import { X, AlertCircle, CheckCircle, RefreshCw, TrendingUp } from 'lucide-react';
import { formatEth } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ReturnNFTModalProps {
  isOpen: boolean;
  onClose: () => void;
  nft: {
    nftId: number;
    collection: string;
    collateral: number;
    rentalFee: number;
    returnDate: string;
    daysRemaining: number;
  };
  onSuccess?: () => void;
}

export function ReturnNFTModal({ isOpen, onClose, nft, onSuccess }: ReturnNFTModalProps) {
  const [returnStep, setReturnStep] = useState<'confirm' | 'processing' | 'success'>('confirm');
  
  const isLate = nft.daysRemaining < 0;
  const lateFee = isLate ? nft.rentalFee * 0.1 : 0; // 10% late fee
  const scoreBoost = isLate ? -10 : 50; // -10 for late, +50 for on-time
  const totalRefund = nft.collateral - lateFee;

  const handleReturn = () => {
    setReturnStep('processing');
    
    // Simulate transaction
    setTimeout(() => {
      setReturnStep('success');
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 3000);
    }, 3000);
  };

  const handleClose = () => {
    setReturnStep('confirm');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md mx-4 card p-0 overflow-hidden"
        >
          {returnStep === 'confirm' && (
            <>
              {/* Header */}
              <div className="p-6 border-b border-dark-border">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold">Return NFT</h3>
                  <button
                    onClick={handleClose}
                    className="p-1 hover:bg-dark-border rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <p className="text-sm text-dark-muted">
                  {nft.collection} #{nft.nftId}
                </p>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Return Status */}
                {isLate ? (
                  <div className="flex items-start gap-3 p-4 bg-ethos-untrusted/10 border border-ethos-untrusted/20 rounded-lg">
                    <AlertCircle className="text-ethos-untrusted flex-shrink-0 mt-0.5" size={20} />
                    <div className="flex-1 text-sm">
                      <p className="font-semibold text-ethos-untrusted mb-1">Late Return</p>
                      <p className="text-dark-muted">
                        This NFT was due {Math.abs(nft.daysRemaining)} days ago. A 10% late fee will be deducted from your collateral.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3 p-4 bg-ethos-exemplary/10 border border-ethos-exemplary/20 rounded-lg">
                    <CheckCircle className="text-ethos-exemplary flex-shrink-0 mt-0.5" size={20} />
                    <div className="flex-1 text-sm">
                      <p className="font-semibold text-ethos-exemplary mb-1">On-Time Return</p>
                      <p className="text-dark-muted">
                        Great job! You'll receive your full collateral back and earn a +50 Ethos score boost.
                      </p>
                    </div>
                  </div>
                )}

                {/* Breakdown */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Return Summary</h4>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between py-2 border-b border-dark-border">
                      <span className="text-dark-muted">Original Collateral</span>
                      <span className="font-semibold">{formatEth(nft.collateral)}</span>
                    </div>
                    
                    {isLate && (
                      <div className="flex items-center justify-between py-2 border-b border-dark-border">
                        <span className="text-ethos-untrusted">Late Fee (10%)</span>
                        <span className="font-semibold text-ethos-untrusted">-{formatEth(lateFee)}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between py-3 bg-dark-bg rounded-lg px-3">
                      <span className="font-semibold">You'll Receive</span>
                      <span className="text-xl font-bold text-gold">{formatEth(totalRefund)}</span>
                    </div>
                  </div>

                  {/* Score Impact */}
                  <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-gold/10 to-transparent border border-gold/20 rounded-lg">
                    <TrendingUp className="text-gold" size={18} />
                    <span className="text-sm">
                      Ethos Score: 
                      <span className={`ml-2 font-bold ${scoreBoost > 0 ? 'text-ethos-exemplary' : 'text-ethos-untrusted'}`}>
                        {scoreBoost > 0 ? '+' : ''}{scoreBoost}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-dark-border space-y-3">
                <button
                  onClick={handleReturn}
                  className="w-full btn-primary"
                >
                  Confirm Return
                </button>
                <button
                  onClick={handleClose}
                  className="w-full btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </>
          )}

          {returnStep === 'processing' && (
            <div className="p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
                <RefreshCw size={32} className="text-gold animate-spin" />
              </div>
              <h3 className="text-xl font-bold mb-3">Processing Return...</h3>
              <p className="text-sm text-dark-muted">
                Transferring wrapper token back and releasing collateral
              </p>
            </div>
          )}

          {returnStep === 'success' && (
            <div className="p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-ethos-exemplary/20 to-ethos-exemplary/5 flex items-center justify-center">
                <CheckCircle size={48} className="text-ethos-exemplary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Return Successful!</h3>
              <p className="text-sm text-dark-muted mb-2">
                Your collateral has been refunded
              </p>
              {!isLate && (
                <p className="text-sm text-ethos-exemplary font-semibold">
                  +50 Ethos Score Earned! 🎉
                </p>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
