'use client';

import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X, Loader2, RefreshCw } from 'lucide-react';
import { NFTCard } from '@/components/NFTCard';
import { MOCK_LISTINGS } from '@/lib/constants';
import { motion } from 'framer-motion';
import { useGetAllListings, useWatchNFTListed } from '@/hooks';
import { toast } from 'sonner';
import { fetchMultipleNFTMetadata, type NFTMetadata } from '@/lib/nftMetadata';

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [minScore, setMinScore] = useState(0);
  const [maxRentalFee, setMaxRentalFee] = useState(10);
  const [maxDuration, setMaxDuration] = useState(90);
  const [showFilters, setShowFilters] = useState(false);
  const [newListingsCount, setNewListingsCount] = useState(0);
  const [nftMetadata, setNftMetadata] = useState<Map<string, NFTMetadata>>(new Map());
  const [fetchingMetadata, setFetchingMetadata] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notifiedListings, setNotifiedListings] = useState<Set<string>>(new Set());

  // Fetch real listings from contract
  const { listings: contractListings, isLoading, isError, error, refetch } = useGetAllListings();

  // Debug: Log contract state
  useEffect(() => {
    console.log('📊 Marketplace Contract State:', {
      isLoading,
      isError,
      errorMessage: error?.message,
      contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      listingsCount: contractListings?.length || 0,
      hasListings: contractListings && contractListings.length > 0,
    });

    if (contractListings && contractListings.length > 0) {
      console.log('📋 Contract Listings:', contractListings);
    }
  }, [contractListings, isLoading, isError, error]);

  // Fetch NFT metadata when contract listings change
  useEffect(() => {
    if (contractListings && contractListings.length > 0) {
      setFetchingMetadata(true);

      const nftsToFetch = contractListings.map(listing => ({
        contractAddress: listing.nft,
        tokenId: listing.tokenId,
      }));

      fetchMultipleNFTMetadata(nftsToFetch)
        .then(metadata => {
          setNftMetadata(metadata);
          console.log('✅ Fetched metadata for', metadata.size, 'NFTs');
        })
        .catch(err => {
          console.error('Failed to fetch NFT metadata:', err);
        })
        .finally(() => {
          setFetchingMetadata(false);
        });
    }
  }, [contractListings]);

  // Listen for new NFT listings in real-time (only show toast ONCE per listing)
  useWatchNFTListed((event) => {
    const listingKey = `${event.args.nft}-${event.args.tokenId}`;

    // Only show notification if we haven't seen this listing before
    if (!notifiedListings.has(listingKey)) {
      console.log('🔔 New NFT listed!', event);
      toast.success('New NFT Listed!', {
        description: `${event.args.nft.slice(0, 6)}...${event.args.nft.slice(-4)} #${event.args.tokenId.toString()}`,
        action: {
          label: 'View Now',
          onClick: () => handleManualRefresh(),
        },
      });

      // Mark this listing as notified
      setNotifiedListings(prev => new Set(prev).add(listingKey));
      setNewListingsCount(prev => prev + 1);

      // Auto-refresh after 2 seconds
      setTimeout(() => {
        refetch();
      }, 2000);
    }
  });

  // Manual refresh handler
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    setNewListingsCount(0);
    await refetch();
    toast.success('Refreshed listings');
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // Use contract listings if available, otherwise fallback to mock data
  const allListings = contractListings && contractListings.length > 0
    ? contractListings.map((listing, index) => {
        const metadataKey = `${listing.nft}-${listing.tokenId}`;
        const metadata = nftMetadata.get(metadataKey);

        return {
          id: index + 1,
          nftId: Number(listing.tokenId),
          collection: metadata?.collection || listing.nft.slice(0, 10) + '...',
          name: metadata?.name || `NFT #${listing.tokenId}`,
          imageUrl: metadata?.image || '',
          rentalFee: 0.5, // TODO: Get from contract
          duration: 7, // TODO: Get from contract
          lenderScore: 1800, // TODO: Get from Ethos API using listing.lender
          floorPrice: metadata?.floorPrice || 0.5,
          lender: listing.lender,
          available: listing.available,
        };
      })
    : MOCK_LISTINGS;

  const filteredListings = allListings.filter(listing => {
    const matchesSearch = listing.collection.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.nftId.toString().includes(searchQuery);
    const matchesScore = listing.lenderScore >= minScore;
    const matchesFee = listing.rentalFee <= maxRentalFee;
    const matchesDuration = listing.duration <= maxDuration;

    return matchesSearch && matchesScore && matchesFee && matchesDuration;
  });

  const resetFilters = () => {
    setMinScore(0);
    setMaxRentalFee(10);
    setMaxDuration(90);
    setSearchQuery('');
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 size={48} className="text-gold animate-spin mb-4" />
          <p className="text-dark-muted">Loading marketplace listings...</p>
        </div>
      </div>
    );
  }

  // Log error but don't block UI - show mock data instead
  if (isError) {
    console.warn('Contract error (showing mock data):', error);
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-6 sm:mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-dark-text">
              NFT <span className="text-gradient">Marketplace</span>
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm sm:text-base text-dark-muted">
                Browse and borrow NFTs from trusted lenders
              </p>
              {contractListings && contractListings.length > 0 ? (
                <span className="text-xs bg-gold/20 text-gold px-2 py-0.5 rounded-full whitespace-nowrap">
                  🟢 Live ({contractListings.length})
                </span>
              ) : isError ? (
                <span className="text-xs bg-orange-500/20 text-orange-500 px-2 py-0.5 rounded-full whitespace-nowrap">
                  Demo Mode
                </span>
              ) : null}
            </div>
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleManualRefresh}
            className="btn-secondary flex items-center gap-2"
            disabled={isLoading || isRefreshing}
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
            {newListingsCount > 0 && !isRefreshing && (
              <span className="bg-gold text-dark-bg rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {newListingsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary lg:hidden"
            aria-label={showFilters ? 'Hide filters' : 'Show filters'}
          >
            {showFilters ? <X size={18} /> : <SlidersHorizontal size={18} />}
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-dark-muted pointer-events-none" size={20} />
          <input
            type="text"
            placeholder="Search by NFT name or collection..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-12 pr-4"
            aria-label="Search marketplace"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Filters Sidebar */}
        <aside className={`lg:w-72 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="card sticky top-20 p-5 sm:p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-base sm:text-lg">Filters</h3>
              <button
                onClick={resetFilters}
                className="text-xs sm:text-sm text-gold hover:underline transition-colors"
                aria-label="Reset all filters"
              >
                Reset All
              </button>
            </div>

            <div className="space-y-6">
              {/* Minimum Score */}
              <div>
                <label htmlFor="min-score" className="block text-sm font-medium mb-3">
                  Minimum Score: <span className="text-gold font-semibold">{minScore}</span>
                </label>
                <input
                  id="min-score"
                  type="range"
                  min="0"
                  max="2800"
                  step="100"
                  value={minScore}
                  onChange={(e) => setMinScore(Number(e.target.value))}
                  className="w-full accent-gold h-2 rounded-lg appearance-none bg-dark-border cursor-pointer"
                  aria-label={`Minimum score filter: ${minScore}`}
                />
                <div className="flex justify-between text-xs text-dark-muted mt-2">
                  <span>0</span>
                  <span>2800</span>
                </div>
              </div>

              {/* Max Rental Fee */}
              <div>
                <label htmlFor="max-fee" className="block text-sm font-medium mb-3">
                  Max Rental Fee: <span className="text-gold font-semibold">{maxRentalFee} ETH</span>
                </label>
                <input
                  id="max-fee"
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={maxRentalFee}
                  onChange={(e) => setMaxRentalFee(Number(e.target.value))}
                  className="w-full accent-gold h-2 rounded-lg appearance-none bg-dark-border cursor-pointer"
                  aria-label={`Maximum rental fee filter: ${maxRentalFee} ETH`}
                />
                <div className="flex justify-between text-xs text-dark-muted mt-2">
                  <span>0</span>
                  <span>10 ETH</span>
                </div>
              </div>

              {/* Max Duration */}
              <div>
                <label htmlFor="max-duration" className="block text-sm font-medium mb-3">
                  Max Duration: <span className="text-gold font-semibold">{maxDuration} days</span>
                </label>
                <input
                  id="max-duration"
                  type="range"
                  min="1"
                  max="90"
                  step="1"
                  value={maxDuration}
                  onChange={(e) => setMaxDuration(Number(e.target.value))}
                  className="w-full accent-gold h-2 rounded-lg appearance-none bg-dark-border cursor-pointer"
                  aria-label={`Maximum duration filter: ${maxDuration} days`}
                />
                <div className="flex justify-between text-xs text-dark-muted mt-2">
                  <span>1d</span>
                  <span>90d</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 pt-6 border-t border-dark-border space-y-3">
              <h4 className="font-medium text-sm mb-3 text-dark-text">Marketplace Stats</h4>
              <div className="flex justify-between items-center text-sm">
                <span className="text-dark-muted">Total Listings</span>
                <span className="font-semibold text-dark-text">
                  {contractListings?.length || allListings.length}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-dark-muted">Avg Fee</span>
                <span className="font-semibold text-gold">
                  {(allListings.reduce((acc, l) => acc + l.rentalFee, 0) / allListings.length).toFixed(2)} ETH
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-dark-muted">Available Now</span>
                <span className="font-semibold text-ethos-exemplary">
                  {contractListings?.filter(l => l.available).length || allListings.length}
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* Listings Grid */}
        <div className="flex-1 min-w-0">
          <div className="mb-4 sm:mb-5 text-sm text-dark-muted">
            Showing <span className="text-gold font-semibold">{filteredListings.length}</span> of {MOCK_LISTINGS.length} listings
          </div>

          {filteredListings.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.08
                  }
                }
              }}
            >
              {filteredListings.map((listing) => (
                <motion.div
                  key={listing.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <NFTCard
                    nftId={listing.nftId}
                    collection={listing.collection}
                    imageUrl={listing.imageUrl}
                    rentalFee={listing.rentalFee}
                    duration={listing.duration}
                    lenderScore={listing.lenderScore}
                    floorPrice={listing.floorPrice}
                    onViewDetails={() => window.location.href = `/marketplace/${listing.id}`}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="card text-center py-12 sm:py-16">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-dark-border flex items-center justify-center">
                <Search size={32} className="text-dark-muted" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-dark-text">
                No listings found
              </h3>
              <p className="text-dark-muted mb-6 text-sm sm:text-base max-w-md mx-auto">
                No listings match your current filters. Try adjusting your search criteria.
              </p>
              <button
                onClick={resetFilters}
                className="btn-primary"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
