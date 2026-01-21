// EthosVault Protocol Types & Rules

export type EthosScoreLevel = 'untrusted' | 'questionable' | 'neutral' | 'reputable' | 'exemplary' | 'revered';

export interface EthosScore {
  value: number;
  level: EthosScoreLevel;
  color: string;
  collateralRate: number; // As percentage of floor price
}

export interface NFT {
  id: string;
  name: string;
  collection: string;
  tokenId: string;
  image: string;
  floorPrice: number; // In ETH
}

export interface LoanListing {
  id: string;
  nft: NFT;
  lender: {
    address: string;
    score: EthosScore;
  };
  rentalFee: number; // In ETH
  duration: number; // In days
  minBorrowerScore: number;
  collateralMultiplier: number;
  airdropSplit?: number; // 0-100, percentage to borrower
  status: 'active' | 'borrowed' | 'completed' | 'cancelled';
  createdAt: Date;
}

export interface ActiveLoan {
  id: string;
  listing: LoanListing;
  borrower: {
    address: string;
    score: EthosScore;
  };
  collateralAmount: number; // In ETH
  startDate: Date;
  returnDate: Date;
  status: 'active' | 'returned' | 'defaulted';
}

export interface UserProfile {
  address: string;
  score: EthosScore;
  totalBorrowed: number; // In ETH
  totalLent: number; // In ETH
  activeLoans: number;
  totalLoans: number;
  onTimeReturns: number;
  lateReturns: number;
  reviews: number;
  memberSince: Date;
}

export interface Activity {
  id: string;
  type: 'borrow' | 'lend' | 'return' | 'score_boost' | 'score_slash' | 'listing_created';
  description: string;
  scoreChange?: number;
  timestamp: Date;
}

// Protocol Constants & Rules
export const ETHOS_SCORE_RULES: Record<EthosScoreLevel, { min: number; max: number; color: string; collateralRate: number }> = {
  untrusted: { min: 0, max: 799, color: '#ef4444', collateralRate: 70 },
  questionable: { min: 800, max: 1199, color: '#f97316', collateralRate: 60 },
  neutral: { min: 1200, max: 1599, color: '#eab308', collateralRate: 50 },
  reputable: { min: 1600, max: 1999, color: '#3b82f6', collateralRate: 40 },
  exemplary: { min: 2000, max: 2399, color: '#10b981', collateralRate: 35 },
  revered: { min: 2400, max: 2800, color: '#14b8a6', collateralRate: 30 },
};

export const MAX_ETHOS_SCORE = 2800;
export const SCORE_BOOST_ON_RETURN = 50;
export const SCORE_SLASH_ON_DEFAULT = 0.5; // 50% slash

// Helper function to get Ethos score details
export function getEthosScoreDetails(score: number): EthosScore {
  let level: EthosScoreLevel = 'untrusted';
  
  for (const [key, rules] of Object.entries(ETHOS_SCORE_RULES)) {
    if (score >= rules.min && score <= rules.max) {
      level = key as EthosScoreLevel;
      break;
    }
  }
  
  const rules = ETHOS_SCORE_RULES[level];
  return {
    value: score,
    level,
    color: rules.color,
    collateralRate: rules.collateralRate,
  };
}

// Calculate required collateral based on floor price and score
export function calculateCollateral(floorPrice: number, score: number): number {
  const scoreDetails = getEthosScoreDetails(score);
  // Collateral = Floor Price × 70% LTV × Collateral Rate Penalty
  const ltv = 0.7;
  const penaltyFactor = scoreDetails.collateralRate / 100;
  return floorPrice * ltv * (1 + penaltyFactor);
}

// Format ETH amounts
export function formatEth(amount: number): string {
  return amount.toFixed(2) + ' ETH';
}

// Format wallet address
export function formatAddress(address: string): string {
  if (address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Calculate days remaining
export function getDaysRemaining(returnDate: Date): number {
  const now = new Date();
  const diff = returnDate.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// Format time remaining
export function formatTimeRemaining(returnDate: Date): string {
  const days = getDaysRemaining(returnDate);
  if (days < 0) return 'Overdue';
  if (days === 0) return 'Due today';
  if (days === 1) return '1 day left';
  return `${days} days left`;
}
