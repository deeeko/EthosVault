'use client';

import { useState, useEffect } from 'react';
import { Check, ChevronRight, Info, Loader2, RefreshCw } from 'lucide-react';
import { MOCK_USER_NFTS, getScoreLevel, calculateCollateral } from '@/lib/constants';
import { formatEth } from '@/lib/utils';
import { RightsTooltip } from '@/components/RightsTooltip';
import { CreateListingModal } from '@/components/CreateListingModal';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserNFTs } from '@/hooks';
import { useAccount } from 'wagmi';

const STEPS = [
  { id: 1, title: 'Select NFT', description: 'Choose an NFT from your wallet to list' },
  { id: 2, title: 'Set Terms', description: 'Define rental fee, duration, and requirements' },
  { id: 3, title: 'Confirm & Approve', description: 'Review and approve the escrow transfer' },
];

export default function LendPage() {
  const { isConnected } = useAccount();
  const { nfts: userNFTs, isLoading: loadingNFTs, error: nftError, refetch } = useUserNFTs();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedNFT, setSelectedNFT] = useState<any>(null);
  const [showListingModal, setShowListingModal] = useState(false);
  const [terms, setTerms] = useState({
    duration: 7,
    rentalFee: 0.5,
    minBorrowerScore: 1200,
    collateralMultiplier: 1,
    airdropSplit: 0,
  });

  // Use user's actual NFTs if available, otherwise fallback to mock
  const displayNFTs = userNFTs.length > 0 ? userNFTs.map((nft, idx) => ({
    id: idx + 1,
    nftId: parseInt(nft.tokenId),
    collection: nft.collection,
    name: nft.name,
    image: nft.image,
    floorPrice: nft.floorPrice || 0.5,
    contractAddress: nft.contractAddress,
  })) : MOCK_USER_NFTS;

  const canProceed = () => {
    if (currentStep === 1) return selectedNFT !== null;
    if (currentStep === 2) return terms.rentalFee > 0 && terms.duration > 0;
    return true;
  };

  const estimatedCollateral = selectedNFT
    ? calculateCollateral(selectedNFT.floorPrice, terms.minBorrowerScore) * terms.collateralMultiplier
    : 0;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 sm:mb-10 text-center max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-dark-text mb-3">
            Create <span className="text-gradient">Listing</span>
          </h1>
          <p className="text-sm sm:text-base text-dark-muted max-w-2xl mx-auto leading-relaxed">
            List your NFT for lending and earn fees from trusted borrowers
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-10 sm:mb-14">
          <div className="flex items-start justify-center max-w-4xl mx-auto">
            {STEPS.map((step, index) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              const isLast = index === STEPS.length - 1;

              return (
                <div key={step.id} className="flex items-center" style={{ flex: isLast ? '0 0 auto' : '1 1 0%' }}>
                  <div className="flex flex-col items-center" style={{ minWidth: '120px' }}>
                    {/* Circle */}
                    <div
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center font-bold text-lg sm:text-xl transition-all duration-300 relative z-10 ${
                        isCompleted
                          ? 'bg-gradient-to-br from-gold to-gold-dark text-dark-bg shadow-lg shadow-gold/30'
                          : isActive
                          ? 'bg-gold/20 text-gold border-2 border-gold shadow-lg shadow-gold/20'
                          : 'bg-dark-card text-dark-muted border-2 border-dark-border'
                      }`}
                    >
                      {isCompleted ? <Check size={28} /> : step.id}
                    </div>

                    {/* Label */}
                    <div className="mt-3 text-center px-2">
                      <p
                        className={`text-xs sm:text-sm font-semibold whitespace-nowrap ${
                          isActive || isCompleted ? 'text-dark-text' : 'text-dark-muted'
                        }`}
                      >
                        {step.title}
                      </p>
                      <p className="text-xs text-dark-muted hidden md:block mt-1 leading-tight max-w-[140px] mx-auto">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Connector Line */}
                  {!isLast && (
                    <div className="flex-1 relative" style={{ marginTop: '-60px', minWidth: '80px' }}>
                      <div className="h-1 mx-3 sm:mx-4 bg-dark-border rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 rounded-full ${
                            currentStep > step.id ? 'bg-gradient-to-r from-gold to-gold-dark w-full' : 'w-0'
                          }`}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {/* Step 1: Select NFT */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-8 max-w-2xl mx-auto">
                <h2 className="text-xl sm:text-2xl font-semibold mb-3 text-dark-text">
                  Choose an NFT from your wallet to list
                </h2>
                <p className="text-sm sm:text-base text-dark-muted">
                  Your NFT will be safely locked in escrow while listed
                  {userNFTs.length > 0 && (
                    <span className="ml-2 text-xs bg-gold/20 text-gold px-2 py-0.5 rounded-full">
                      {userNFTs.length} NFTs Found
                    </span>
                  )}
                  {nftError && (
                    <span className="ml-2 text-xs bg-orange-500/20 text-orange-500 px-2 py-0.5 rounded-full">
                      Demo Mode
                    </span>
                  )}
                </p>
              </div>

              {/* Loading state */}
              {loadingNFTs && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 size={48} className="text-gold animate-spin mb-4" />
                  <p className="text-dark-muted">Loading your NFTs...</p>
                </div>
              )}

              {/* NFT Grid */}
              {!loadingNFTs && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto">
                  {displayNFTs.map((nft) => (
                  <motion.div
                    key={nft.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedNFT(nft)}
                    className={`card-glow cursor-pointer transition-all p-5 sm:p-6 ${
                      selectedNFT?.id === nft.id
                        ? 'ring-2 ring-gold shadow-xl shadow-gold/20'
                        : ''
                    }`}
                  >
                    {/* NFT Image */}
                    <div className="w-full aspect-square bg-gradient-to-br from-dark-border to-dark-bg rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                      {nft.image ? (
                        <img
                          src={nft.image}
                          alt={nft.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-4">
                          <div className="text-6xl sm:text-7xl mb-3">🖼️</div>
                          <div className="text-xs sm:text-sm text-dark-muted font-mono">#{nft.nftId}</div>
                        </div>
                      )}
                    </div>

                    {/* NFT Info */}
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-base sm:text-lg text-dark-text truncate">
                          {nft.name || `${nft.collection} #${nft.nftId}`}
                        </h3>
                        <p className="text-xs sm:text-sm text-dark-muted truncate">{nft.collection}</p>
                      </div>

                      <div className="pt-3 border-t border-dark-border">
                        <p className="text-xs text-dark-muted mb-1">Floor Price</p>
                        <p className="font-semibold text-base sm:text-lg text-gold">{formatEth(nft.floorPrice)}</p>
                      </div>
                    </div>

                    {selectedNFT?.id === nft.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-4"
                      >
                        <div className="flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-gold/20 to-gold/10 rounded-lg text-gold text-sm font-semibold">
                          <Check size={18} />
                          Selected
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                  ))}
                </div>
              )}

              {/* Empty state */}
              {!loadingNFTs && displayNFTs.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-dark-muted mb-4">No NFTs found in your wallet</p>
                  <button onClick={refetch} className="btn-secondary inline-flex items-center gap-2">
                    <RefreshCw size={16} />
                    Refresh
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* Step 2: Set Terms */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-3xl mx-auto space-y-8"
            >
              <div className="text-center mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold mb-3 text-dark-text">
                  Set your listing terms
                </h2>
                <p className="text-sm sm:text-base text-dark-muted">
                  Define rental fee, duration, and borrower requirements
                </p>
              </div>

              <div className="card p-6 sm:p-8 space-y-8">
                {/* Rental Fee */}
                <div>
                  <label htmlFor="rental-fee" className="block text-sm sm:text-base font-medium mb-3">
                    Rental Fee (ETH)
                  </label>
                  <input
                    id="rental-fee"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={terms.rentalFee}
                    onChange={(e) => setTerms({ ...terms, rentalFee: Number(e.target.value) })}
                    className="input-field text-base"
                    placeholder="0.5"
                  />
                  <p className="text-xs sm:text-sm text-dark-muted mt-2">
                    Upfront fee paid by borrower when loan activates
                  </p>
                </div>

                {/* Duration */}
                <div>
                  <label htmlFor="duration" className="block text-sm sm:text-base font-medium mb-3">
                    Duration (days): <span className="text-gold font-semibold">{terms.duration}</span>
                  </label>
                  <input
                    id="duration"
                    type="range"
                    min="1"
                    max="90"
                    value={terms.duration}
                    onChange={(e) => setTerms({ ...terms, duration: Number(e.target.value) })}
                    className="w-full accent-gold h-2 rounded-lg appearance-none bg-dark-border cursor-pointer"
                  />
                  <div className="flex justify-between text-xs sm:text-sm text-dark-muted mt-2">
                    <span>1 day</span>
                    <span>90 days</span>
                  </div>
                </div>

                {/* Min Borrower Score */}
                <div>
                  <label htmlFor="min-score" className="block text-sm sm:text-base font-medium mb-3">
                    Minimum Borrower Score: <span className="text-gold font-semibold">{terms.minBorrowerScore}</span>
                  </label>
                  <input
                    id="min-score"
                    type="range"
                    min="0"
                    max="2800"
                    step="100"
                    value={terms.minBorrowerScore}
                    onChange={(e) => setTerms({ ...terms, minBorrowerScore: Number(e.target.value) })}
                    className="w-full accent-gold h-2 rounded-lg appearance-none bg-dark-border cursor-pointer"
                  />
                  <div className="flex justify-between text-xs sm:text-sm text-dark-muted mt-2">
                    <span>0 (Any)</span>
                    <span>2800 (Max)</span>
                  </div>
                  <p className="text-xs sm:text-sm text-dark-muted mt-3">
                    Required collateral: <span className="text-gold font-semibold">{formatEth(estimatedCollateral)}</span>
                    {' '}({getScoreLevel(terms.minBorrowerScore).collateral}% of floor × multiplier)
                  </p>
                </div>

                {/* Collateral Multiplier */}
                <div>
                  <label htmlFor="collateral-mult" className="block text-sm sm:text-base font-medium mb-3 flex items-center gap-2">
                    Collateral Multiplier: <span className="text-gold font-semibold">{terms.collateralMultiplier}x</span>
                    <div className="group relative">
                      <Info size={16} className="text-dark-muted cursor-help" />
                      <div className="tooltip w-64 bottom-full left-1/2 transform -translate-x-1/2 mb-2">
                        <p className="text-xs">Multiply base collateral requirement for extra security</p>
                      </div>
                    </div>
                  </label>
                  <input
                    id="collateral-mult"
                    type="range"
                    min="1"
                    max="3"
                    step="0.1"
                    value={terms.collateralMultiplier}
                    onChange={(e) => setTerms({ ...terms, collateralMultiplier: Number(e.target.value) })}
                    className="w-full accent-gold h-2 rounded-lg appearance-none bg-dark-border cursor-pointer"
                  />
                  <div className="flex justify-between text-xs sm:text-sm text-dark-muted mt-2">
                    <span>1x (Standard)</span>
                    <span>3x (High Security)</span>
                  </div>
                </div>

                {/* Airdrop Split */}
                <div>
                  <label htmlFor="airdrop-split" className="block text-sm sm:text-base font-medium mb-3 flex items-center gap-2">
                    Airdrop Split to Borrower: <span className="text-gold font-semibold">{terms.airdropSplit}%</span>
                    <div className="group relative">
                      <Info size={16} className="text-dark-muted cursor-help" />
                      <div className="tooltip w-64 bottom-full left-1/2 transform -translate-x-1/2 mb-2">
                        <p className="text-xs">Optional: Share airdrops with high-score borrowers as incentive</p>
                      </div>
                    </div>
                  </label>
                  <input
                    id="airdrop-split"
                    type="range"
                    min="0"
                    max="50"
                    step="5"
                    value={terms.airdropSplit}
                    onChange={(e) => setTerms({ ...terms, airdropSplit: Number(e.target.value) })}
                    className="w-full accent-gold h-2 rounded-lg appearance-none bg-dark-border cursor-pointer"
                  />
                  <div className="flex justify-between text-xs sm:text-sm text-dark-muted mt-2">
                    <span>0% (Keep all)</span>
                    <span>50% (Share half)</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Confirm */}
          {currentStep === 3 && selectedNFT && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-3xl mx-auto space-y-8"
            >
              <div className="text-center mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold mb-3 text-dark-text">
                  Review and confirm your listing
                </h2>
                <p className="text-sm sm:text-base text-dark-muted">
                  You'll need to approve the NFT transfer to our escrow contract
                </p>
              </div>

              <div className="card p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-dark-border">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-dark-border to-dark-bg rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-4xl">🖼️</span>
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-semibold text-lg sm:text-xl text-dark-text mb-1">
                      {selectedNFT.collection} #{selectedNFT.nftId}
                    </h3>
                    <p className="text-sm text-dark-muted">
                      Floor: <span className="text-gold font-semibold">{formatEth(selectedNFT.floorPrice)}</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  <div className="p-4 bg-dark-bg rounded-lg">
                    <p className="text-xs sm:text-sm text-dark-muted mb-1">Rental Fee</p>
                    <p className="font-semibold text-base sm:text-lg text-gold">{formatEth(terms.rentalFee)}</p>
                  </div>
                  <div className="p-4 bg-dark-bg rounded-lg">
                    <p className="text-xs sm:text-sm text-dark-muted mb-1">Duration</p>
                    <p className="font-semibold text-base sm:text-lg text-dark-text">{terms.duration} days</p>
                  </div>
                  <div className="p-4 bg-dark-bg rounded-lg">
                    <p className="text-xs sm:text-sm text-dark-muted mb-1">Min Score</p>
                    <p className="font-semibold text-base sm:text-lg text-dark-text">{terms.minBorrowerScore}</p>
                  </div>
                  <div className="p-4 bg-dark-bg rounded-lg">
                    <p className="text-xs sm:text-sm text-dark-muted mb-1">Req. Collateral</p>
                    <p className="font-semibold text-base sm:text-lg text-dark-text">{formatEth(estimatedCollateral)}</p>
                  </div>
                  <div className="p-4 bg-dark-bg rounded-lg">
                    <p className="text-xs sm:text-sm text-dark-muted mb-1">Collateral Mult.</p>
                    <p className="font-semibold text-base sm:text-lg text-dark-text">{terms.collateralMultiplier}x</p>
                  </div>
                  <div className="p-4 bg-dark-bg rounded-lg">
                    <p className="text-xs sm:text-sm text-dark-muted mb-1">Airdrop Split</p>
                    <p className="font-semibold text-base sm:text-lg text-dark-text">{terms.airdropSplit}%</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-dark-border">
                  <div className="flex items-start gap-4 p-4 bg-gold/5 border border-gold/20 rounded-lg">
                    <RightsTooltip />
                    <div className="flex-1 text-xs sm:text-sm text-dark-muted">
                      <p className="font-medium text-dark-text mb-2">You retain full ownership</p>
                      <p className="leading-relaxed">
                        Your NFT will be locked in escrow. Borrower gets usage-only wrapper token.
                        You'll receive airdrops and rental fees.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  className="w-full btn-primary py-4 text-base sm:text-lg font-bold"
                  onClick={() => setShowListingModal(true)}
                >
                  Approve & Create Listing
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Create Listing Modal */}
        {selectedNFT && (
          <CreateListingModal
            isOpen={showListingModal}
            onClose={() => setShowListingModal(false)}
            listing={{
              nftId: selectedNFT.nftId,
              collection: selectedNFT.collection,
              floorPrice: selectedNFT.floorPrice,
              ...terms,
            }}
            onSuccess={() => {
              console.log('Listing created successfully');
            }}
          />
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-10 sm:mt-12 max-w-3xl mx-auto">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
          >
            Back
          </button>

          {currentStep < 3 && (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceed()}
              className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px] justify-center"
            >
              Next: {STEPS[currentStep]?.title}
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
