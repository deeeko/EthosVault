'use client';

import { LoanListing } from '@/lib/types';
import { formatEth } from '@/lib/types';
import Image from 'next/image';
import ScoreBadge from './ScoreBadge';
import { Clock, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface ListingCardProps {
  listing: LoanListing;
  onViewDetails?: () => void;
}

export default function ListingCard({ listing, onViewDetails }: ListingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="w-full max-w-[280px]"
    >
      <div className="rounded-xl overflow-hidden ring-1 ring-dark-200 hover:ring-primary-500/50 transition-all duration-300 bg-dark-300">
        {/* NFT Image */}
        <div className="relative h-56 w-full bg-dark-400">
          <Image
            src={listing.nft.image}
            alt={listing.nft.name}
            fill
            className="object-cover"
            unoptimized
          />
          {/* Score Badge Overlay */}
          <div className="absolute top-2 right-2">
            <ScoreBadge score={listing.lender.score} size="sm" showValue={true} />
          </div>
        </div>

        {/* Listing Info */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-white text-base truncate">
              {listing.nft.name}
            </h3>
            <p className="text-gray-400 text-sm truncate">{listing.nft.collection}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-500 text-xs mb-0.5">Rental Fee</p>
              <p className="text-primary-500 font-semibold">{formatEth(listing.rentalFee)}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-0.5">Duration</p>
              <div className="flex items-center gap-1 text-white font-semibold">
                <Clock className="w-3 h-3 text-gray-400" />
                <span>{listing.duration}d</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-dark-200">
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Zap className="w-3.5 h-3.5" />
              <span>Lender</span>
            </div>
            <ScoreBadge score={listing.lender.score} size="sm" showValue={false} />
          </div>

          <button
            onClick={onViewDetails}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-dark-500 font-semibold text-sm transition-all duration-200 hover:shadow-lg hover:shadow-primary-500/30"
          >
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
}
