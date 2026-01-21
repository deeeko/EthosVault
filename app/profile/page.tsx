'use client';

import Link from 'next/link';
import { User, TrendingUp, Award, Calendar, ArrowUp, ArrowDown, Plus, Loader2, AlertCircle, ExternalLink } from 'lucide-react';
import { MOCK_USER, MOCK_ACTIVITY, ETHOS_SCORE_LEVELS, MAX_ETHOS_SCORE, getScoreLevel } from '@/lib/constants';
import { ScoreBadge } from '@/components/ScoreBadge';
import { formatAddress, formatEth } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { useEthos } from '@/hooks/useEthos';
import { useConnectModal } from '@rainbow-me/rainbowkit';

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const { ethosProfile, loading, error, connectEthos } = useEthos();
  const { openConnectModal } = useConnectModal();

  // Use real wallet data when connected, fallback to mock data for demo
  const userScore = ethosProfile?.score ?? MOCK_USER.score;
  const userAddress = address || MOCK_USER.address;
  const userName = ethosProfile?.displayName || ethosProfile?.username || null;
  const userLevel = getScoreLevel(userScore);
  const scorePercentage = (userScore / MAX_ETHOS_SCORE) * 100;

  // Show loading state while fetching Ethos profile
  if (loading && isConnected) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-16 h-16 mb-6 rounded-full bg-gradient-to-br from-gold/20 to-gold-dark/20 flex items-center justify-center">
            <Loader2 size={32} className="text-gold animate-spin" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-dark-text">Loading Ethos Profile...</h3>
          <p className="text-dark-muted text-sm">Fetching your reputation data from Ethos Network</p>
        </div>
      </div>
    );
  }

  // Show connect wallet prompt if not connected
  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card p-8 sm:p-12 text-center max-w-md"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-gold/20 to-gold-dark/20 flex items-center justify-center">
              <User size={40} className="text-gold" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-dark-text">Connect Your Wallet</h2>
            <p className="text-dark-muted mb-8">
              Connect your wallet to view your Ethos profile and reputation history
            </p>
            <button
              onClick={() => openConnectModal?.()}
              className="btn-primary w-full py-4"
            >
              Connect Wallet
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-dark-text">
          <span className="text-gradient">Profile</span>
        </h1>
        <p className="text-dark-muted mt-2">
          View your reputation and activity history
        </p>
      </div>

      {/* No Ethos Profile Warning */}
      {!ethosProfile && !loading && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-gold/10 border border-gold/30 rounded-lg flex items-start gap-3"
        >
          <AlertCircle size={20} className="text-gold flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-dark-text mb-1">
              No Ethos Profile Found
            </p>
            <p className="text-xs text-dark-muted mb-3">
              Your wallet doesn't have an Ethos Network profile yet. Create one to start building your reputation.
            </p>
            <button
              onClick={connectEthos}
              className="btn-secondary text-xs py-2 px-4 flex items-center gap-2"
            >
              <ExternalLink size={14} />
              Create Ethos Profile
            </button>
          </div>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - User Info & Score */}
        <div className="lg:col-span-1 space-y-6">
          {/* User Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-glow text-center p-5 sm:p-6"
          >
            {/* Avatar */}
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 bg-gradient-to-br from-gold to-gold-dark blur-xl opacity-30 animate-pulse"></div>
              {ethosProfile?.avatarUrl ? (
                <img
                  src={ethosProfile.avatarUrl}
                  alt="Profile Avatar"
                  className="relative w-24 h-24 rounded-full border-2 border-gold object-cover"
                />
              ) : (
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 border-2 border-gold flex items-center justify-center">
                  <User size={40} className="text-gold" />
                </div>
              )}
            </div>

            {/* Display Name */}
            {userName && (
              <div className="mb-3">
                <p className="text-lg font-semibold text-dark-text">{userName}</p>
              </div>
            )}

            {/* Wallet Address */}
            <div className="mb-4">
              <p className="text-sm text-dark-muted mb-1">Wallet Address</p>
              <code className="text-xs font-mono bg-dark-bg px-3 py-1.5 rounded border border-dark-border">
                {formatAddress(userAddress)}
              </code>
            </div>

            {/* Ethos Score - Large Display */}
            <div className="py-6 border-y border-dark-border my-4">
              <p className="text-sm text-dark-muted mb-2">Ethos Score</p>
              <div className="flex items-center justify-center gap-3 mb-3">
                <span className="text-5xl font-bold text-gradient">{userScore}</span>
                <ScoreBadge score={userScore} size="lg" showLabel={false} />
              </div>
              <div className="flex items-center justify-center gap-2 text-sm">
                <span
                  className="px-3 py-1 rounded-full font-semibold"
                  style={{
                    backgroundColor: `${userLevel.color}20`,
                    color: userLevel.color,
                  }}
                >
                  {userLevel.label}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-dark-muted mb-1">Total Borrowed</p>
                <p className="font-semibold text-gold">{formatEth(MOCK_USER.totalBorrowed)}</p>
              </div>
              <div>
                <p className="text-dark-muted mb-1">Total Lent</p>
                <p className="font-semibold text-gold">{formatEth(MOCK_USER.totalLent)}</p>
              </div>
              <div>
                <p className="text-dark-muted mb-1">Reviews</p>
                <p className="font-semibold">{MOCK_USER.reviewsCount} <span className="text-ethos-exemplary text-xs">positive</span></p>
              </div>
              <div>
                <p className="text-dark-muted mb-1">Avg Duration</p>
                <p className="font-semibold">{MOCK_USER.avgDuration} days</p>
              </div>
            </div>

            {/* Member Since */}
            <div className="mt-4 pt-4 border-t border-dark-border">
              <div className="flex items-center justify-center gap-2 text-sm text-dark-muted">
                <Calendar size={14} />
                <span>Member since {MOCK_USER.memberSince}</span>
              </div>
            </div>

            {/* Ethos Profile Link */}
            {ethosProfile?.links?.profile && (
              <div className="mt-4">
                <a
                  href={ethosProfile.links.profile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary w-full text-xs py-2 flex items-center justify-center gap-2"
                >
                  <ExternalLink size={14} />
                  View on Ethos Network
                </a>
              </div>
            )}
          </motion.div>

          {/* Score Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-5 sm:p-6"
          >
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-gold" />
              Score Progress
            </h3>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-dark-muted">Current: {userScore}</span>
                <span className="text-dark-muted">Max: {MAX_ETHOS_SCORE}</span>
              </div>
              <div className="h-3 bg-dark-border rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${scorePercentage}%` }}
                  transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full"
                ></motion.div>
              </div>
            </div>

            {/* Score Levels Legend */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-dark-muted mb-3">Score Levels</h4>
              {Object.values(ETHOS_SCORE_LEVELS).map((level) => {
                const isCurrentLevel = userScore >= level.min && userScore <= level.max;

                return (
                  <div
                    key={level.label}
                    className={`flex items-center justify-between text-xs p-2 rounded ${
                      isCurrentLevel ? 'bg-dark-border' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: level.color }}
                      ></div>
                      <span className={isCurrentLevel ? 'font-semibold' : 'text-dark-muted'}>
                        {level.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-dark-muted">
                        {level.min}-{level.max}
                      </span>
                      <span
                        className="font-semibold"
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

        {/* Right Column - Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-5 sm:p-6"
          >
            <h3 className="font-semibold text-xl mb-6 flex items-center gap-2">
              <Award className="text-gold" size={20} />
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
                        className="flex items-center gap-4 p-4 bg-dark-bg rounded-lg border border-dark-border hover:border-gold/30 transition-colors"
                      >
                        {/* Icon */}
                        <div className={`w-10 h-10 rounded-lg ${bgColors[activity.type as keyof typeof bgColors]} flex items-center justify-center flex-shrink-0`}>
                          <Icon size={20} className={colors[activity.type as keyof typeof colors]} />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-dark-text">{activity.title}</h4>
                          <p className="text-sm text-dark-muted">{activity.subtitle}</p>
                        </div>

                        {/* Score Change & Time */}
                        <div className="flex items-center gap-4 flex-shrink-0">
                          {activity.scoreChange !== 0 && (
                            <div className={`flex items-center gap-1 font-semibold ${
                              activity.scoreChange > 0 ? 'text-ethos-exemplary' : 'text-ethos-untrusted'
                            }`}>
                              {activity.scoreChange > 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                              {Math.abs(activity.scoreChange)}
                            </div>
                          )}
                          <span className="text-xs text-dark-muted">{activity.timestamp}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </>
              ) : (
                // Empty State
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-dark-card border-2 border-dark-border flex items-center justify-center">
                    <Award size={32} className="text-dark-muted" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2 text-dark-text">No Activity Yet</h4>
                  <p className="text-sm text-dark-muted mb-6 max-w-sm mx-auto">
                    Start lending or borrowing NFTs to build your reputation and activity history.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/marketplace" className="btn-primary inline-flex items-center justify-center">
                      Browse Marketplace
                    </Link>
                    <Link href="/lend" className="btn-secondary inline-flex items-center justify-center">
                      List an NFT
                    </Link>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Reputation Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card bg-gradient-to-br from-gold/5 to-transparent border-gold/20 p-5 sm:p-6"
          >
            <h3 className="font-semibold text-lg mb-4 text-gradient">
              Building Your Reputation
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-ethos-exemplary text-lg">+50</span>
                <div>
                  <p className="font-medium text-dark-text">Timely Returns</p>
                  <p className="text-dark-muted text-xs">Return borrowed NFTs on time</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-ethos-exemplary text-lg">+50</span>
                <div>
                  <p className="font-medium text-dark-text">Successful Lending</p>
                  <p className="text-dark-muted text-xs">Lend NFTs that get returned</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-ethos-untrusted text-lg">-50%</span>
                <div>
                  <p className="font-medium text-dark-text">Default Penalty</p>
                  <p className="text-dark-muted text-xs">Score slashed in half on defaults</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-gold text-lg">↓</span>
                <div>
                  <p className="font-medium text-dark-text">Lower Collateral</p>
                  <p className="text-dark-muted text-xs">Higher scores = less collateral needed</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
