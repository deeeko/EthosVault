'use client';

import { Clock, TrendingUp } from 'lucide-react';
import { ScoreBadge } from './ScoreBadge';
import { formatEth } from '@/lib/utils';

interface NFTCardProps {
  nftId: number;
  collection: string;
  imageUrl: string;
  rentalFee: number;
  duration: number;
  lenderScore: number;
  floorPrice?: number;
  onViewDetails?: () => void;
}

export function NFTCard({
  nftId,
  collection,
  imageUrl,
  rentalFee,
  duration,
  lenderScore,
  floorPrice,
  onViewDetails,
}: NFTCardProps) {
  return (
    <div className="card-glow group cursor-pointer" onClick={onViewDetails}>
      {/* NFT Image */}
      <div className="relative w-full aspect-square mb-3 rounded-lg overflow-hidden bg-dark-border">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="w-full h-full flex items-center justify-center text-dark-muted">
          <div className="text-center">
            <div className="text-6xl mb-2">🖼️</div>
            <div className="text-xs opacity-70">NFT #{nftId}</div>
          </div>
        </div>
        
        {/* Lender Score Badge */}
        <div className="absolute top-2 right-2">
          <ScoreBadge score={lenderScore} size="sm" showLabel={false} />
        </div>
      </div>

      {/* NFT Info */}
      <div className="space-y-2">
        <div>
          <h3 className="font-semibold text-dark-text group-hover:text-gold transition-colors">
            {collection} #{nftId}
          </h3>
          <p className="text-xs text-dark-muted">{collection}</p>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div>
            <p className="text-xs text-dark-muted">Rental Fee</p>
            <p className="font-semibold text-gold">{formatEth(rentalFee)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-dark-muted">Duration</p>
            <p className="font-semibold text-dark-text flex items-center gap-1">
              <Clock size={14} />
              {duration}d
            </p>
          </div>
        </div>

        {floorPrice && (
          <div className="flex items-center gap-1 text-xs text-dark-muted pt-1 border-t border-dark-border">
            <TrendingUp size={12} />
            Floor: {formatEth(floorPrice)}
          </div>
        )}

        <button className="w-full btn-secondary text-sm py-2 mt-2">
          View Details
        </button>
      </div>
    </div>
  );
}
