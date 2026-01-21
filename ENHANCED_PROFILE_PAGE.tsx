// ENHANCED PROFILE PAGE WITH:
// - Better spacing and padding
// - Real Ethos API integration
// - "View Ethos Profile" button
// - Loading states
// - Improved responsive design

// COPY THIS FILE CONTENT TO: app/profile/page.tsx

'use client';

import Link from 'next/link';
import { User, TrendingUp, Award, Calendar, ArrowUp, ArrowDown, Plus, ExternalLink, Loader2, Shield } from 'lucide-react';
import { MOCK_USER, MOCK_ACTIVITY, ETHOS_SCORE_LEVELS, MAX_ETHOS_SCORE, getScoreLevel } from '@/lib/constants';
import { ScoreBadge } from '@/components/ScoreBadge';
import { formatAddress, formatEth } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { useEthos } from '@/hooks/useEthos';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const { ethosProfile, loading, connectEthos } = useEthos();
  const [displayScore, setDisplayScore] = useState(MOCK_USER.score);

  // Use real Ethos score when connected, otherwise use mock
  useEffect(() => {
    if (isConnected && ethosProfile) {
      setDisplayScore(ethosProfile.score);
    } else {
      setDisplayScore(MOCK_USER.score);
    }
  }, [isConnected, ethosProfile]);

  const userLevel = getScoreLevel(displayScore);
  const scorePercentage = (displayScore / MAX_ETHOS_SCORE) * 100;
  const displayAddress = address || MOCK_USER.address;

  // Generate Ethos profile URL
  const ethosProfileUrl = address
    ? `https://ethos.network/profile/${address}`
    : '#';

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 max-w-7xl">
      {/* Header with improved spacing */}
      <div className="mb-8 lg:mb-10">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-dark-text mb-3">
          <span className="text-gradient">Profile</span>
        </h1>
        <p className="text-dark-muted text-base sm:text-lg">
          View your reputation and activity history
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column - User Info & Score */}
        <div className="lg:col-span-1 space-y-6">
          {/* User Card with improved padding */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-glow text-center p-6 sm:p-8"
          >
            {/* Avatar */}
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-gold to-gold-dark blur-xl opacity-30 animate-pulse"></div>
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 border-2 border-gold flex items-center justify-center">
                <User size={44} className="text-gold" />
              </div>
            </div>

            {/* Wallet Address with better spacing */}
            <div className="mb-6">
              <p className="text-sm text-dark-muted mb-2">Wallet Address</p>
              <code className="text-xs sm:text-sm font-mono bg-dark-bg px-4 py-2 rounded border border-dark-border inline-block">
                {formatAddress(displayAddress)}
              </code>
            </div>

            {/* Ethos Score - Large Display with enhanced spacing */}
            <div className="py-6 border-y border-dark-border my-6">
              <p className="text-sm text-dark-muted mb-3">Ethos Score</p>
              <div className="flex items-center justify-center gap-3 mb-4">
                {loading ? (
                  <Loader2 size={40} className="text-gold animate-spin" />
                ) : (
                  <>
                    <span className="text-5xl sm:text-6xl font-bold text-gradient">{displayScore}</span>
                    <ScoreBadge score={displayScore} size="lg" showLabel={false} />
                  </>
                )}
              </div>
              <div className="flex items-center justify-center gap-2 text-sm mb-4">
                <span
                  className="px-4 py-1.5 rounded-full font-semibold"
                  style={{
                    backgroundColor: `${userLevel.color}20`,
                    color: userLevel.color,
                  }}
                >
                  {userLevel.label}
                </span>
              </div>

              {/* View Ethos Profile Button */}
              {isConnected && (
                <div className="mt-4 space-y-2">
                  <a
                    href={ethosProfileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gold/10 to-gold/5 border border-gold/30 rounded-lg hover:border-gold/50 transition-all text-sm font-medium text-gold hover:text-gold-light"
                  >
                    <Shield size={16} />
                    <span>View Ethos Profile</span>
                    <ExternalLink size={14} />
                  </a>

                  {!ethosProfile?.verified && (
                    <button
                      onClick={connectEthos}
                      className="w-full px-4 py-2 bg-ethos-reputable/10 border border-ethos-reputable/30 rounded-lg hover:border-ethos-reputable/50 transition-all text-sm font-medium text-ethos-reputable"
                    >
                      Verify with Ethos Network
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Stats with improved spacing */}
            <div className="grid grid-cols-2 gap-4 text-sm mb-6">
              <div className="p-3 bg-dark-bg rounded-lg">
                <p className="text-dark-muted mb-1.5">Total Borrowed</p>
                <p className="font-semibold text-gold text-base">{formatEth(MOCK_USER.totalBorrowed)}</p>
              </div>
              <div className="p-3 bg-dark-bg rounded-lg">
                <p className="text-dark-muted mb-1.5">Total Lent</p>
                <p className="font-semibold text-gold text-base">{formatEth(MOCK_USER.totalLent)}</p>
              </div>
              <div className="p-3 bg-dark-bg rounded-lg">
                <p className="text-dark-muted mb-1.5">Reviews</p>
                <p className="font-semibold">{MOCK_USER.reviewsCount} <span className="text-ethos-exemplary text-xs">positive</span></p>
              </div>
              <div className="p-3 bg-dark-bg rounded-lg">
                <p className="text-dark-muted mb-1.5">Avg Duration</p>
                <p className="font-semibold">{MOCK_USER.avgDuration} days</p>
              </div>
            </div>

            {/* Member Since with improved spacing */}
            <div className="pt-5 border-t border-dark-border">
              <div className="flex items-center justify-center gap-2 text-sm text-dark-muted">
                <Calendar size={16} />
                <span>Member since {MOCK_USER.memberSince}</span>
              </div>
            </div>
          </motion.div>

          {/* Score Progress with improved padding */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6"
          >
            <h3 className="font-semibold mb-5 flex items-center gap-2 text-lg">
              <TrendingUp size={20} className="text-gold" />
              Score Progress
            </h3>

            {/* Progress Bar with better spacing */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="text-dark-muted">Current: {displayScore}</span>
                <span className="text-dark-muted">Max: {MAX_ETHOS_SCORE}</span>
              </div>
              <div className="h-3 bg-dark-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full transition-all duration-500"
                  style={{ width: `${scorePercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Score Levels Legend with improved spacing */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-medium text-dark-muted mb-4">Score Levels</h4>
              {Object.values(ETHOS_SCORE_LEVELS).map((level) => {
                const isCurrentLevel = displayScore >= level.min && displayScore <= level.max;

                return (
                  <div
                    key={level.label}
                    className={`flex items-center justify-between text-xs p-3 rounded-lg transition-all ${
                      isCurrentLevel ? 'bg-dark-border border border-gold/20' : 'hover:bg-dark-bg'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: level.color }}
                      ></div>
                      <span className={isCurrentLevel ? 'font-semibold text-dark-text' : 'text-dark-muted'}>
                        {level.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-dark-muted">
                        {level.min}-{level.max}
                      </span>
                      <span
                        className="font-semibold min-w-[40px] text-right"
                        style={{ color: level.color }}
                      >
                        {level.collateral}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Right Column - Activity with improved spacing */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Activity with better padding */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6 sm:p-8"
          >
            <h3 className="font-semibold text-xl mb-6 flex items-center gap-2">
              <Award className="text-gold" size={22} />
              Recent Activity
            </h3>

            <div className="space-y-4">
              {MOCK_ACTIVITY.length > 0 ? (
                <>
                  {MOCK_ACTIVITY.map((activity, index) => {
                    const icons = {
                      return: ArrowUp,
                      list: Plus,
                      borrow: ArrowDown,
                    };
                    const Icon = icons[activity.type as keyof typeof icons];

                    const colors = {
                      return: 'text-ethos-exemplary',
                      list: 'text-gold',
                      borrow: 'text-ethos-reputable',
                    };
                    const bgColors = {
                      return: 'bg-ethos-exemplary/10',
                      list: 'bg-gold/10',
                      borrow: 'bg-ethos-reputable/10',
                    };

                    return (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-center gap-4 p-4 sm:p-5 bg-dark-bg rounded-lg border border-dark-border hover:border-gold/30 transition-colors"
                      >
                        {/* Icon with improved sizing */}
                        <div className={`w-12 h-12 rounded-lg ${bgColors[activity.type as keyof typeof bgColors]} flex items-center justify-center flex-shrink-0`}>
                          <Icon size={22} className={colors[activity.type as keyof typeof colors]} />
                        </div>

                        {/* Details with better spacing */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-dark-text mb-1">{activity.title}</h4>
                          <p className="text-sm text-dark-muted">{activity.subtitle}</p>
                        </div>

                        {/* Score Change & Time with improved layout */}
                        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-4 flex-shrink-0">
                          {activity.scoreChange !== 0 && (
                            <div className={`flex items-center gap-1 font-semibold text-sm ${
                              activity.scoreChange > 0 ? 'text-ethos-exemplary' : 'text-ethos-untrusted'
                            }`}>
                              {activity.scoreChange > 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                              {Math.abs(activity.scoreChange)}
                            </div>
                          )}
                          <span className="text-xs text-dark-muted whitespace-nowrap">{activity.timestamp}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </>
              ) : (
                // Empty State with improved spacing
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16"
                >
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-dark-card border-2 border-dark-border flex items-center justify-center">
                    <Award size={40} className="text-dark-muted" />
                  </div>
                  <h4 className="text-xl font-semibold mb-3 text-dark-text">No Activity Yet</h4>
                  <p className="text-base text-dark-muted mb-8 max-w-md mx-auto px-4">
                    Start lending or borrowing NFTs to build your reputation and activity history.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/marketplace" className="btn-primary inline-flex items-center justify-center px-6 py-3">
                      Browse Marketplace
                    </Link>
                    <Link href="/lend" className="btn-secondary inline-flex items-center justify-center px-6 py-3">
                      List an NFT
                    </Link>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Reputation Tips with improved padding and spacing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-6 sm:p-8 bg-gradient-to-br from-gold/5 to-transparent border-gold/20"
          >
            <h3 className="font-semibold text-lg sm:text-xl mb-6 text-gradient">
              Building Your Reputation
            </h3>
            <div className="grid sm:grid-cols-2 gap-5 text-sm">
              <div className="flex items-start gap-3 p-4 bg-dark-bg/50 rounded-lg">
                <span className="text-ethos-exemplary text-xl font-bold">+50</span>
                <div>
                  <p className="font-medium text-dark-text mb-1">Timely Returns</p>
                  <p className="text-dark-muted text-xs leading-relaxed">Return borrowed NFTs on time</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-dark-bg/50 rounded-lg">
                <span className="text-ethos-exemplary text-xl font-bold">+50</span>
                <div>
                  <p className="font-medium text-dark-text mb-1">Successful Lending</p>
                  <p className="text-dark-muted text-xs leading-relaxed">Lend NFTs that get returned</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-dark-bg/50 rounded-lg">
                <span className="text-ethos-untrusted text-xl font-bold">-50%</span>
                <div>
                  <p className="font-medium text-dark-text mb-1">Default Penalty</p>
                  <p className="text-dark-muted text-xs leading-relaxed">Score slashed in half on defaults</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-dark-bg/50 rounded-lg">
                <span className="text-gold text-xl font-bold">↓</span>
                <div>
                  <p className="font-medium text-dark-text mb-1">Lower Collateral</p>
                  <p className="text-dark-muted text-xs leading-relaxed">Higher scores = less collateral needed</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
