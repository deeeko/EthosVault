// Protocol Rules and Constants for EthosVault

export const ETHOS_SCORE_LEVELS = {
  UNTRUSTED: { min: 0, max: 799, label: 'Untrusted', color: '#EF4444', collateral: 70 },
  QUESTIONABLE: { min: 800, max: 1199, label: 'Questionable', color: '#F97316', collateral: 60 },
  NEUTRAL: { min: 1200, max: 1599, label: 'Neutral', color: '#EAB308', collateral: 50 },
  REPUTABLE: { min: 1600, max: 1999, label: 'Reputable', color: '#3B82F6', collateral: 40 },
  EXEMPLARY: { min: 2000, max: 2399, label: 'Exemplary', color: '#10B981', collateral: 35 },
  REVERED: { min: 2400, max: 2800, label: 'Revered', color: '#14B8A6', collateral: 30 },
} as const;

export const MAX_ETHOS_SCORE = 2800;

export const SCORE_BOOST = {
  TIMELY_RETURN: 50,
  SUCCESSFUL_LEND: 50,
  DEFAULT_SLASH: 0.5, // Slash score in half
};

// Get score level based on score value
export function getScoreLevel(score: number) {
  for (const level of Object.values(ETHOS_SCORE_LEVELS)) {
    if (score >= level.min && score <= level.max) {
      return level;
    }
  }
  return ETHOS_SCORE_LEVELS.UNTRUSTED;
}

// Calculate required collateral
export function calculateCollateral(floorPrice: number, score: number) {
  const level = getScoreLevel(score);
  const ltv = 0.7; // 70% LTV
  const penaltyFactor = level.collateral / 100;
  return floorPrice * ltv * penaltyFactor;
}

// Protocol flow descriptions
export const PROTOCOL_FLOW = {
  title: "How EthosVault Works",
  steps: [
    {
      icon: "Lock",
      title: "Lender Lists NFT",
      description: "NFT is approved and transferred to secure escrow contract"
    },
    {
      icon: "HandCoins",
      title: "Borrower Requests",
      description: "Pays rental fee upfront + posts dynamic collateral based on Ethos score"
    },
    {
      icon: "Shield",
      title: "Escrow Activation",
      description: "Non-transferable wrapper token minted to borrower, original NFT stays locked"
    },
    {
      icon: "Gamepad2",
      title: "Use NFT Utility",
      description: "Borrower uses NFT via wrapper for games/metaverses (full utility)"
    },
    {
      icon: "RefreshCw",
      title: "Return & Rewards",
      description: "Wrapper returned → collateral refunded → both parties get +50 Ethos score"
    }
  ]
};

export const RIGHTS_INFO = {
  lender: "Retains full ownership, receives all airdrops (default), gets rental fees",
  borrower: "Temporary usage only via wrapper, cannot sell/transfer, full utility access",
  escrow: "Neutral automated enforcer, no discretion, executes rules only",
  antiTheft: "Wrapper non-transferable (blacklisted), attempts trigger liquidation + major Ethos slash",
  airdrops: "Default to lender (true owner). Optional splits for high-score borrowers (set in listing terms)"
};

// Mock NFT Collections
export const NFT_COLLECTIONS = [
  {
    id: 'bored-apes',
    name: 'Bored Ape Yacht Club',
    floorPrice: 30.5,
  },
  {
    id: 'cryptopunks',
    name: 'CryptoPunks',
    floorPrice: 45.2,
  },
  {
    id: 'azuki',
    name: 'Azuki',
    floorPrice: 12.8,
  },
  {
    id: 'cool-cats',
    name: 'Cool Cats',
    floorPrice: 2.5,
  },
  {
    id: 'moonbirds',
    name: 'Moonbirds',
    floorPrice: 4.8,
  },
  {
    id: 'doodles',
    name: 'Doodles',
    floorPrice: 5.2,
  },
  {
    id: 'clonex',
    name: 'CloneX',
    floorPrice: 8.9,
  },
  {
    id: 'mutant-apes',
    name: 'Mutant Ape Yacht Club',
    floorPrice: 15.3,
  },
];

// Mock NFT Listings
export const MOCK_LISTINGS = [
  {
    id: '1',
    nftId: 7495,
    collection: 'Bored Ape Yacht Club',
    collectionId: 'bored-apes',
    imageUrl: 'https://placeholder.com/300x300',
    rentalFee: 0.5,
    duration: 7,
    lenderAddress: '0x742d...0bEb',
    lenderScore: 1850,
    minBorrowerScore: 1200,
    floorPrice: 30.5,
    airdropSplit: 0,
  },
  {
    id: '2',
    nftId: 3100,
    collection: 'CryptoPunks',
    collectionId: 'cryptopunks',
    imageUrl: 'https://placeholder.com/300x300',
    rentalFee: 1.2,
    duration: 14,
    lenderAddress: '0x8ba1...BA72',
    lenderScore: 2150,
    minBorrowerScore: 1600,
    floorPrice: 45.2,
    airdropSplit: 0,
  },
  {
    id: '3',
    nftId: 9605,
    collection: 'Azuki',
    collectionId: 'azuki',
    imageUrl: 'https://placeholder.com/300x300',
    rentalFee: 1.35,
    duration: 5,
    lenderAddress: '0x5f9...1a82',
    lenderScore: 1950,
    minBorrowerScore: 1200,
    floorPrice: 12.8,
    airdropSplit: 10,
  },
  {
    id: '4',
    nftId: 6914,
    collection: 'Doodles',
    collectionId: 'doodles',
    imageUrl: 'https://placeholder.com/300x300',
    rentalFee: 0.3,
    duration: 10,
    lenderAddress: '0x1cd...9f21',
    lenderScore: 1450,
    minBorrowerScore: 800,
    floorPrice: 5.2,
    airdropSplit: 0,
  },
  {
    id: '5',
    nftId: 15023,
    collection: 'Mutant Ape Yacht Club',
    collectionId: 'mutant-apes',
    imageUrl: 'https://placeholder.com/300x300',
    rentalFee: 0.8,
    duration: 7,
    lenderAddress: '0x9ab...cd45',
    lenderScore: 2250,
    minBorrowerScore: 1600,
    floorPrice: 15.3,
    airdropSplit: 5,
  },
  {
    id: '6',
    nftId: 12456,
    collection: 'CloneX',
    collectionId: 'clonex',
    imageUrl: 'https://placeholder.com/300x300',
    rentalFee: 0.6,
    duration: 12,
    lenderAddress: '0x3ef...8bc9',
    lenderScore: 2450,
    minBorrowerScore: 1200,
    floorPrice: 8.9,
    airdropSplit: 15,
  },
];

// Mock User NFTs (for lend page)
export const MOCK_USER_NFTS = [
  {
    id: 'nft-1',
    nftId: 4521,
    collection: 'Cool Cats',
    collectionId: 'cool-cats',
    imageUrl: 'https://placeholder.com/300x300',
    floorPrice: 2.5,
  },
  {
    id: 'nft-2',
    nftId: 2891,
    collection: 'Moonbirds',
    collectionId: 'moonbirds',
    imageUrl: 'https://placeholder.com/300x300',
    floorPrice: 4.8,
  },
];

// Mock Active Loans (for borrow dashboard)
export const MOCK_ACTIVE_LOANS = [
  {
    id: 'loan-1',
    nftId: 7495,
    collection: 'Bored Ape Yacht Club',
    collectionId: 'bored-apes',
    imageUrl: 'https://placeholder.com/300x300',
    collateral: 2.25,
    rentalFee: 0.5,
    returnDate: '2026-01-25',
    lenderAddress: '0x742d...0bEb',
    lenderScore: 1850,
    daysRemaining: 4,
    hoursRemaining: 21,
    minutesRemaining: 44,
  },
  {
    id: 'loan-2',
    nftId: 3100,
    collection: 'CryptoPunks',
    collectionId: 'cryptopunks',
    imageUrl: 'https://placeholder.com/300x300',
    collateral: 3,
    rentalFee: 1.2,
    returnDate: '2026-01-27',
    lenderAddress: '0x8ba1...BA72',
    lenderScore: 2150,
    daysRemaining: 6,
    hoursRemaining: 21,
    minutesRemaining: 51,
  },
];

// Mock User Data
export const MOCK_USER = {
  address: '0x742d350c663409...595f80Eb',
  score: 1850,
  totalBorrowed: 2.4,
  totalLent: 1.8,
  reviewsCount: 28,
  positiveReviews: 28,
  avgDuration: 12,
  onTimeReturns: 12,
  totalLoans: 12,
  memberSince: 'Jan 2024',
  totalLocked: 6.95,
  activeLoans: 2,
};

// Mock Recent Activity
export const MOCK_ACTIVITY = [
  {
    id: '1',
    type: 'return',
    title: 'Returned NFT On-Time',
    subtitle: 'Bored Ape #7495',
    scoreChange: +5,
    timestamp: '2 days ago',
  },
  {
    id: '2',
    type: 'list',
    title: 'Created Listing',
    subtitle: 'Cool Cat #4521',
    scoreChange: +2,
    timestamp: '5 days ago',
  },
  {
    id: '3',
    type: 'borrow',
    title: 'Borrowed NFT',
    subtitle: 'CryptoPunk #3100',
    scoreChange: 0,
    timestamp: '1 week ago',
  },
];
