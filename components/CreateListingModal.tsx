'use client';

import { useState } from 'react';
import { X, CheckCircle, RefreshCw, Lock, TrendingUp } from 'lucide-react';
import { formatEth } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: {
    nftId: number;
    collection: string;
    floorPrice: number;
    rentalFee: number;
    duration: number;
    minBorrowerScore: number;
    collateralMultiplier: number;
    airdropSplit: number;
  };
  onSuccess?: () => void;
}

export function CreateListingModal({ isOpen, onClose, listing, onSuccess }: CreateListingModalProps) {
  const [listingStep, setListingStep] = useState<'confirm' | 'processing' | 'success'>('confirm');
  
  const estimatedCollateral = listing.floorPrice * 0.7 * (listing.minBorrowerScore < 800 ? 0.7 : 
                               listing.minBorrowerScore < 1200 ? 0.6 :
                               listing.minBorrowerScore < 1600 ? 0.5 :
                               listing.minBorrowerScore < 2000 ? 0.4 :
                               listing.minBorrowerScore < 2400 ? 0.35 : 0.3);

  const handleCreateListing = () => {
    setListingStep('processing');
    
    // Simulate transaction
    setTimeout(() => {
      setListingStep('success');
      setTimeout(() => {
        onSuccess?.();
        handleClose();
      }, 3000);
    }, 3000);
  };

  const handleClose = () => {
    setListingStep('confirm');
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
          {listingStep === 'confirm' && (
            <>
              {/* Header */}
              <div className="p-6 border-b border-dark-border">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold">Approve & Create Listing</h3>
                  <button
                    onClick={handleClose}
                    className="p-1 hover:bg-dark-border rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <p className="text-sm text-dark-muted">
                  {listing.collection} #{listing.nftId}
                </p>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Info Card */}
                <div className="flex items-start gap-3 p-4 bg-gold/10 border border-gold/20 rounded-lg">
                  <Lock className="text-gold flex-shrink-0 mt-0.5" size={20} />
                  <div className="flex-1 text-sm">
                    <p className="font-semibold text-gold mb-1">NFT will be locked in escrow</p>
                    <p className="text-dark-muted">
                      Your NFT will be safely transferred to the escrow contract. You retain ownership and will receive rental fees.
                    </p>
                  </div>
                </div>

                {/* Listing Details */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Listing Summary</h4>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between py-2 border-b border-dark-border">
                      <span className="text-dark-muted">Rental Fee</span>
                      <span className="font-semibold text-gold">{formatEth(listing.rentalFee)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between py-2 border-b border-dark-border">
                      <span className="text-dark-muted">Duration</span>
                      <span className="font-semibold">{listing.duration} days</span>
                    </div>
                    
                    <div className="flex items-center justify-between py-2 border-b border-dark-border">
                      <span className="text-dark-muted">Min Borrower Score</span>
                      <span className="font-semibold">{listing.minBorrowerScore}</span>
                    </div>
                    
                    <div className="flex items-center justify-between py-2 border-b border-dark-border">
                      <span className="text-dark-muted">Collateral Multiplier</span>
                      <span className="font-semibold">{listing.collateralMultiplier}x</span>
                    </div>
                    
                    <div className="flex items-center justify-between py-2 border-b border-dark-border">
                      <span className="text-dark-muted">Airdrop Split</span>
                      <span className="font-semibold">{listing.airdropSplit}%</span>
                    </div>
                    
                    <div className="flex items-center justify-between py-3 bg-dark-bg rounded-lg px-3">
                      <span className="font-semibold">Est. Borrower Collateral</span>
                      <span className="text-lg font-bold text-gold">{formatEth(estimatedCollateral)}</span>
                    </div>
                  </div>

                  {/* Earnings Info */}
                  <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-gold/10 to-transparent border border-gold/20 rounded-lg">
                    <TrendingUp className="text-gold" size={18} />
                    <span className="text-sm">
                      You'll earn: 
                      <span className="ml-2 font-bold text-gold">
                        {formatEth(listing.rentalFee)} + 50 Ethos Score
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-dark-border space-y-3">
                <button
                  onClick={handleCreateListing}
                  className="w-full btn-primary"
                >
                  Approve & Create Listing
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

          {listingStep === 'processing' && (
            <div className="p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
                <RefreshCw size={32} className="text-gold animate-spin" />
              </div>
              <h3 className="text-xl font-bold mb-3">Creating Listing...</h3>
              <p className="text-sm text-dark-muted">
                Approving NFT transfer and creating your listing
              </p>
            </div>
          )}

          {listingStep === 'success' && (
            <div className="p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-ethos-exemplary/20 to-ethos-exemplary/5 flex items-center justify-center">
                <CheckCircle size={48} className="text-ethos-exemplary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Listing Created!</h3>
              <p className="text-sm text-dark-muted mb-2">
                Your NFT is now available for borrowing
              </p>
              <p className="text-sm text-ethos-exemplary font-semibold">
                +50 Ethos Score on successful rental! 🎉
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
