'use client';

import { useState } from 'react';
import { Clock, DollarSign, TrendingUp, Award, Lightbulb, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { MOCK_ACTIVE_LOANS, MOCK_USER } from '@/lib/constants';
import { ScoreBadge } from '@/components/ScoreBadge';
import { ReturnNFTModal } from '@/components/ReturnNFTModal';
import { formatEth, formatDate } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function BorrowPage() {
  const [selectedLoan, setSelectedLoan] = useState<typeof MOCK_ACTIVE_LOANS[0] | null>(null);
  const [showReturnModal, setShowReturnModal] = useState(false);

  const handleReturnClick = (loan: typeof MOCK_ACTIVE_LOANS[0]) => {
    setSelectedLoan(loan);
    setShowReturnModal(true);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl">{/* ... rest of the component stays the same until the Return NFT button ... */}
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-dark-text">
          Borrower <span className="text-gradient">Dashboard</span>
        </h1>
        <p className="text-dark-muted mt-2">
          Manage your borrowed NFTs and loan status
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className="card-glow p-5 sm:p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
              <Clock className="text-gold" size={20} />
            </div>
            <h3 className="text-sm text-dark-muted">Active Loans</h3>
          </div>
          <p className="text-3xl font-bold">{MOCK_USER.activeLoans}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-glow p-5 sm:p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
              <DollarSign className="text-gold" size={20} />
            </div>
            <h3 className="text-sm text-dark-muted">Total Locked</h3>
          </div>
          <p className="text-3xl font-bold text-gold">{formatEth(MOCK_USER.totalLocked)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-glow p-5 sm:p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-ethos-exemplary/10 flex items-center justify-center">
              <Award className="text-ethos-exemplary" size={20} />
            </div>
            <h3 className="text-sm text-dark-muted">Your Score</h3>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-bold">{MOCK_USER.score}</p>
            <ScoreBadge score={MOCK_USER.score} size="sm" showLabel={false} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-glow p-5 sm:p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-ethos-exemplary/10 flex items-center justify-center">
              <TrendingUp className="text-ethos-exemplary" size={20} />
            </div>
            <h3 className="text-sm text-dark-muted">On-Time Returns</h3>
          </div>
          <p className="text-3xl font-bold text-ethos-exemplary">
            {Math.round((MOCK_USER.onTimeReturns / MOCK_USER.totalLoans) * 100)}%
          </p>
          <p className="text-xs text-dark-muted mt-1">
            {MOCK_USER.onTimeReturns}/{MOCK_USER.totalLoans} loans
          </p>
        </motion.div>
      </div>

      {/* Active Loans */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-semibold">Active Loans</h2>
          <Link href="/marketplace" className="btn-secondary flex items-center gap-2">
            Browse More NFTs
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="space-y-4">
          {MOCK_ACTIVE_LOANS.map((loan, index) => (
            <motion.div
              key={loan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="card-glow p-5 sm:p-6"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* NFT Image */}
                <div className="flex-shrink-0">
                  <div className="w-full lg:w-32 aspect-square bg-dark-border rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-1">🖼️</div>
                      <div className="text-xs text-dark-muted">#{loan.nftId}</div>
                    </div>
                  </div>
                </div>

                {/* Loan Info */}
                <div className="flex-1 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      {loan.collection} #{loan.nftId}
                    </h3>
                    <p className="text-xs text-dark-muted">{loan.collection}</p>
                  </div>

                  <div>
                    <p className="text-xs text-dark-muted mb-1">Collateral</p>
                    <p className="font-semibold text-lg">{formatEth(loan.collateral)}</p>
                  </div>

                  <div>
                    <p className="text-xs text-dark-muted mb-1">Rental Fee</p>
                    <p className="font-semibold text-lg text-gold">{formatEth(loan.rentalFee)}</p>
                  </div>

                  <div>
                    <p className="text-xs text-dark-muted mb-1">Return Date</p>
                    <p className="font-semibold">{formatDate(loan.returnDate)}</p>
                  </div>

                  <div className="sm:col-span-2">
                    <p className="text-xs text-dark-muted mb-1">Lender</p>
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-mono">{loan.lenderAddress}</code>
                      <ScoreBadge score={loan.lenderScore} size="sm" />
                    </div>
                  </div>

                  <div className="sm:col-span-2 flex items-center gap-3">
                    {/* Countdown Timer */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock size={16} className="text-gold" />
                        <span className="font-mono font-semibold text-gold">
                          {loan.daysRemaining}d {loan.hoursRemaining}h {loan.minutesRemaining}m
                        </span>
                        <span className="text-dark-muted">remaining</span>
                      </div>
                      {/* Progress Bar */}
                      <div className="w-full h-1.5 bg-dark-border rounded-full mt-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full transition-all"
                          style={{ width: '65%' }}
                        ></div>
                      </div>
                    </div>

                    <button className="btn-primary flex-shrink-0" onClick={() => handleReturnClick(loan)}>
                      Return NFT
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {MOCK_ACTIVE_LOANS.length === 0 && (
            <div className="card text-center py-12">
              <p className="text-dark-muted mb-4">You don't have any active loans</p>
              <Link href="/marketplace" className="btn-primary">
                Browse Marketplace
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Borrowing Tips */}
      <div className="card bg-gradient-to-br from-gold/5 to-transparent border-gold/20 p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center">
            <Lightbulb className="text-gold" size={20} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <span className="text-gradient">Borrowing Tips</span>
            </h3>
            <ul className="space-y-2 text-sm text-dark-muted">
              <li className="flex items-start gap-2">
                <span className="text-ethos-exemplary mt-0.5">✓</span>
                <span>Return NFTs on time to get your collateral back and earn +50 score boosts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ethos-questionable mt-0.5">✗</span>
                <span>Late returns incur a 10% fee and will lower your Ethos score</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold mt-0.5">⚠</span>
                <span>Wrapped NFTs can be used in games/metaverses but cannot be transferred or sold</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ethos-reputable mt-0.5">💡</span>
                <span>Build your reputation by consistently honoring loan agreements</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Return NFT Modal */}
      {selectedLoan && (
        <ReturnNFTModal
          isOpen={showReturnModal}
          onClose={() => setShowReturnModal(false)}
          nft={selectedLoan}
          onSuccess={() => {
            // TODO: Refresh loans data
            console.log('NFT returned successfully');
          }}
        />
      )}
    </div>
  );
}
