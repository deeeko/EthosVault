'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Clock, TrendingUp, Shield, Info, CheckCircle, AlertCircle } from 'lucide-react';
import { MOCK_LISTINGS, calculateCollateral, getScoreLevel, MOCK_USER } from '@/lib/constants';
import { ScoreBadge } from '@/components/ScoreBadge';
import { RightsTooltip } from '@/components/RightsTooltip';
import { formatEth, formatDate } from '@/lib/utils';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRequestLoan, useCalculateCollateralAmount } from '@/hooks';
import { parseEther } from 'viem';
import { toast } from 'sonner';

export default function MarketplaceItemPage() {
  const params = useParams();
  const router = useRouter();
  const [borrowStep, setBorrowStep] = useState<'details' | 'confirm' | 'processing' | 'success'>('details');

  const listing = MOCK_LISTINGS.find(l => l.id === params.id);

  if (!listing) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center max-w-2xl">
        <div className="card p-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-dark-border flex items-center justify-center">
            <AlertCircle size={40} className="text-dark-muted" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Listing Not Found</h2>
          <p className="text-dark-muted mb-6">
            This NFT listing could not be found or may have been removed.
          </p>
          <Link href="/marketplace" className="btn-primary">
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  const requiredCollateral = calculateCollateral(listing.floorPrice, MOCK_USER.score);
  const userLevel = getScoreLevel(MOCK_USER.score);
  const meetsMinScore = MOCK_USER.score >= listing.minBorrowerScore;

  // Calculate collateral using contract hook
  const { collateralAmount, collateralEth } = useCalculateCollateralAmount(
    listing.floorPrice,
    MOCK_USER.score
  );

  // Request loan hook
  const {
    requestLoan,
    isPending,
    isConfirming,
    isSuccess,
  } = useRequestLoan(
    () => {
      toast.success('Loan requested! NFT wrapper minted.');
      setBorrowStep('success');
    },
    (error) => {
      toast.error(`Request failed: ${error.message}`);
      setBorrowStep('confirm');
    }
  );

  const handleBorrowClick = () => {
    if (!meetsMinScore) {
      alert('Your Ethos score does not meet the minimum requirement for this listing.');
      return;
    }
    setBorrowStep('confirm');
  };

  const handleConfirmBorrow = async () => {
    setBorrowStep('processing');

    // Use real contract if collateralAmount is available
    if (collateralAmount) {
      try {
        // TODO: Replace with actual listing ID from contract
        const listingId = BigInt(listing.id);
        await requestLoan(
          listingId,
          MOCK_USER.score,
          parseEther(listing.floorPrice.toString()),
          collateralAmount
        );
      } catch (error) {
        console.error('Loan request error:', error);
        setBorrowStep('confirm');
      }
    } else {
      // Fallback to mock behavior for demo
      setTimeout(() => {
        setBorrowStep('success');
      }, 3000);
    }
  };

  const handleViewDashboard = () => {
    router.push('/borrow');
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl">
      {/* Back Button */}
      <Link
        href="/marketplace"
        className="inline-flex items-center gap-2 text-sm sm:text-base text-dark-muted hover:text-gold transition-colors mb-6 group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span>Back to Marketplace</span>
      </Link>

      {borrowStep === 'details' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-5 gap-6 lg:gap-8"
        >
          {/* Left side - NFT Display (2 columns on large screens) */}
          <div className="lg:col-span-2 space-y-6">
            {/* NFT Image */}
            <div className="card p-5 sm:p-6">
              <div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-dark-border to-dark-bg flex items-center justify-center mb-4">
                <div className="text-center p-6">
                  <div className="text-7xl sm:text-9xl mb-4">🖼️</div>
                  <div className="text-2xl sm:text-3xl font-mono text-dark-muted">#{listing.nftId}</div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs text-dark-muted mb-1">Collection</p>
                <p className="font-semibold text-base">{listing.collection}</p>
              </div>
            </div>

            {/* Collection Info */}
            <div className="card p-5 sm:p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2 text-base sm:text-lg">
                <TrendingUp size={18} className="text-gold" />
                Collection Details
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-dark-bg rounded-lg">
                  <p className="text-dark-muted mb-1 text-xs">Collection</p>
                  <p className="font-semibold text-sm">{listing.collection}</p>
                </div>
                <div className="p-3 bg-dark-bg rounded-lg">
                  <p className="text-dark-muted mb-1 text-xs">Token ID</p>
                  <p className="font-semibold text-sm">#{listing.nftId}</p>
                </div>
                <div className="p-3 bg-dark-bg rounded-lg">
                  <p className="text-dark-muted mb-1 text-xs">Floor Price</p>
                  <p className="font-semibold text-gold text-sm">{formatEth(listing.floorPrice)}</p>
                </div>
                <div className="p-3 bg-dark-bg rounded-lg">
                  <p className="text-dark-muted mb-1 text-xs">Contract</p>
                  <p className="font-mono text-xs truncate">0xABC...DEF</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Listing Details (3 columns on large screens) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Title & Lender */}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold mb-3">
                {listing.collection} <span className="text-gold">#{listing.nftId}</span>
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="text-dark-muted">Listed by</span>
                <code className="font-mono text-xs sm:text-sm bg-dark-bg px-2 py-1 rounded">{listing.lenderAddress}</code>
                <ScoreBadge score={listing.lenderScore} size="sm" />
              </div>
            </div>

            {/* Rental Terms */}
            <div className="card bg-gradient-to-br from-gold/10 via-gold/5 to-transparent border-gold/30 p-5 sm:p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2 text-base sm:text-lg">
                <Clock size={18} className="text-gold" />
                Rental Terms
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-dark-card/50 rounded-lg">
                  <p className="text-xs text-dark-muted mb-2">Rental Fee</p>
                  <p className="text-xl sm:text-2xl font-bold text-gold">{formatEth(listing.rentalFee)}</p>
                </div>
                <div className="p-4 bg-dark-card/50 rounded-lg">
                  <p className="text-xs text-dark-muted mb-2">Duration</p>
                  <p className="text-xl sm:text-2xl font-bold">{listing.duration} days</p>
                </div>
                <div className="p-4 bg-dark-card/50 rounded-lg">
                  <p className="text-xs text-dark-muted mb-2">Min Score Required</p>
                  <p className="text-base sm:text-lg font-semibold">{listing.minBorrowerScore}</p>
                </div>
                <div className="p-4 bg-dark-card/50 rounded-lg">
                  <p className="text-xs text-dark-muted mb-2">Airdrop Split</p>
                  <p className="text-base sm:text-lg font-semibold">{listing.airdropSplit}%</p>
                </div>
              </div>
            </div>

            {/* Your Requirements */}
            <div className="card p-5 sm:p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2 text-base sm:text-lg">
                <Shield size={18} className="text-ethos-reputable" />
                Your Requirements
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-dark-bg rounded-lg border border-dark-border">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Your Ethos Score</p>
                    <p className="text-xs text-dark-muted mt-1">
                      {meetsMinScore ? '✓ Meets requirement' : '✗ Below minimum required'}
                    </p>
                  </div>
                  <ScoreBadge score={MOCK_USER.score} size="md" />
                </div>

                <div className="flex items-center justify-between p-4 bg-dark-bg rounded-lg border border-dark-border">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Required Collateral</p>
                    <p className="text-xs text-dark-muted mt-1">
                      {userLevel.collateral}% of floor price (your level)
                    </p>
                  </div>
                  <p className="text-lg sm:text-xl font-bold text-gold">{formatEth(requiredCollateral)}</p>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-br from-gold/10 to-transparent rounded-lg border border-gold/30">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gold">Total Upfront Cost</p>
                    <p className="text-xs text-dark-muted mt-1">
                      Rental fee + collateral (refundable)
                    </p>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-gold">{formatEth(listing.rentalFee + requiredCollateral)}</p>
                </div>
              </div>
            </div>

            {/* Rights Info */}
            <div className="card bg-gold/5 border-gold/20 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center">
                    <Info size={20} className="text-gold" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gold mb-3 text-sm sm:text-base">How Borrowing Works</h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-dark-muted">
                    <li className="flex items-start gap-2">
                      <span className="text-gold mt-0.5">•</span>
                      <span>You'll receive a non-transferable wrapper token with full NFT utility</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gold mt-0.5">•</span>
                      <span>Original NFT stays safely locked in escrow during the loan</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-ethos-exemplary mt-0.5">•</span>
                      <span>Return on time to get your collateral back + 50 Ethos score boost</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-ethos-untrusted mt-0.5">•</span>
                      <span>Late returns incur penalties and score reduction</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Borrow Button */}
            <button
              onClick={handleBorrowClick}
              disabled={!meetsMinScore}
              className="w-full btn-primary py-4 text-base sm:text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
              aria-label={meetsMinScore ? 'Borrow this NFT' : 'Your score is too low to borrow this NFT'}
            >
              {meetsMinScore ? (
                <>Borrow This NFT for {formatEth(listing.rentalFee + requiredCollateral)}</>
              ) : (
                <>Score Too Low (Need {listing.minBorrowerScore}+)</>
              )}
            </button>
          </div>
        </motion.div>
      )}

      {borrowStep === 'confirm' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto"
        >
          <div className="card p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">Confirm Borrow Request</h2>

            {/* Summary */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center justify-between py-3 border-b border-dark-border">
                <span className="text-dark-muted text-sm">NFT</span>
                <span className="font-semibold text-sm sm:text-base">{listing.collection} #{listing.nftId}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-dark-border">
                <span className="text-dark-muted text-sm">Rental Fee</span>
                <span className="font-semibold text-gold text-sm sm:text-base">{formatEth(listing.rentalFee)}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-dark-border">
                <span className="text-dark-muted text-sm">Collateral (Refundable)</span>
                <span className="font-semibold text-sm sm:text-base">{formatEth(requiredCollateral)}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-dark-border">
                <span className="text-dark-muted text-sm">Duration</span>
                <span className="font-semibold text-sm sm:text-base">{listing.duration} days</span>
              </div>
              <div className="flex items-center justify-between py-4 bg-dark-bg rounded-lg px-4 mt-4">
                <span className="font-semibold text-sm sm:text-base">Total Payment</span>
                <span className="text-xl sm:text-2xl font-bold text-gold">
                  {formatEth(listing.rentalFee + requiredCollateral)}
                </span>
              </div>
            </div>

            {/* Info Box */}
            <div className="mb-6 p-4 bg-gold/5 border border-gold/20 rounded-lg">
              <p className="text-xs sm:text-sm text-dark-muted">
                <strong className="text-gold">Note:</strong> Your collateral will be returned when you return the NFT on time.
                The wrapper token will be minted to your wallet for full utility access.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setBorrowStep('details')}
                disabled={isPending || isConfirming}
                className="flex-1 btn-secondary"
              >
                Go Back
              </button>
              <button
                onClick={handleConfirmBorrow}
                disabled={isPending || isConfirming}
                className="flex-1 btn-primary"
              >
                {isPending ? 'Signing Transaction...' : isConfirming ? 'Confirming...' : 'Confirm & Pay'}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {borrowStep === 'processing' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto"
        >
          <div className="card p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-3">Processing Transaction...</h2>
            <p className="text-sm sm:text-base text-dark-muted">
              Please confirm the transaction in your wallet and wait for blockchain confirmation.
            </p>
            <div className="mt-6 p-3 bg-dark-bg rounded-lg text-xs text-dark-muted">
              This usually takes 10-30 seconds
            </div>
          </div>
        </motion.div>
      )}

      {borrowStep === 'success' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto"
        >
          <div className="card p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-ethos-exemplary/20 to-ethos-exemplary/5 flex items-center justify-center">
              <CheckCircle size={48} className="text-ethos-exemplary" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-3">Borrow Successful!</h2>
            <p className="text-sm sm:text-base text-dark-muted mb-8">
              Your wrapper token has been minted. You can now use this NFT in supported games and platforms.
              Remember to return it on time!
            </p>

            <div className="space-y-3">
              <button
                onClick={handleViewDashboard}
                className="w-full btn-primary"
              >
                View in Dashboard
              </button>
              <Link href="/marketplace" className="w-full btn-secondary block text-center">
                Browse More NFTs
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
