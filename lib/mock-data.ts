// Mock data for EthosVault development
import { NFT, LoanListing, ActiveLoan, UserProfile, Activity, getEthosScoreDetails } from './types';

// Mock NFTs
export const mockNFTs: NFT[] = [
  {
    id: '1',
    name: 'Cool Cat #4521',
    collection: 'Cool Cats',
    tokenId: '4521',
    image: 'https://via.placeholder.com/400/3b82f6/ffffff?text=Cool+Cat+4521',
    floorPrice: 2.2,
  },
  {
    id: '2',
    name: 'Moonbird #2891',
    collection: 'Moonbirds',
    tokenId: '2891',
    image: 'https://via.placeholder.com/400/8b5cf6/ffffff?text=Moonbird+2891',
    floorPrice: 4.8,
  },
  {
    id: '3',
    name: 'Bored Ape #7495',
    collection: 'Bored Ape Yacht Club',
    tokenId: '7495',
    image: 'https://via.placeholder.com/400/f59e0b/ffffff?text=BAYC+7495',
    floorPrice: 35.0,
  },
  {
    id: '4',
    name: 'CryptoPunk #3100',
    collection: 'CryptoPunks',
    tokenId: '3100',
    image: 'https://via.placeholder.com/400/ec4899/ffffff?text=Punk+3100',
    floorPrice: 50.0,
  },
  {
    id: '5',
    name: 'Azuki #9605',
    collection: 'Azuki',
    tokenId: '9605',
    image: 'https://via.placeholder.com/400/ef4444/ffffff?text=Azuki+9605',
    floorPrice: 8.35,
  },
  {
    id: '6',
    name: 'Doodles #6914',
    collection: 'Doodles',
    tokenId: '6914',
    image: 'https://via.placeholder.com/400/10b981/ffffff?text=Doodle+6914',
    floorPrice: 3.5,
  },
  {
    id: '7',
    name: 'Mutant Ape #15023',
    collection: 'Mutant Ape Yacht Club',
    tokenId: '15023',
    image: 'https://via.placeholder.com/400/06b6d4/ffffff?text=MAYC+15023',
    floorPrice: 12.0,
  },
  {
    id: '8',
    name: 'CloneX #12456',
    collection: 'CloneX',
    tokenId: '12456',
    image: 'https://via.placeholder.com/400/6366f1/ffffff?text=CloneX+12456',
    floorPrice: 6.2,
  },
];

// Mock listings
export const mockListings: LoanListing[] = [
  {
    id: 'listing-1',
    nft: mockNFTs[2], // Bored Ape
    lender: {
      address: '0x742d35Cc6633C0532e3a0bCBr...595f80cEb',
      score: getEthosScoreDetails(2150),
    },
    rentalFee: 0.5,
    duration: 7,
    minBorrowerScore: 1500,
    collateralMultiplier: 1.0,
    airdropSplit: 0,
    status: 'active',
    createdAt: new Date('2025-01-15'),
  },
  {
    id: 'listing-2',
    nft: mockNFTs[3], // CryptoPunk
    lender: {
      address: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
      score: getEthosScoreDetails(1850),
    },
    rentalFee: 1.2,
    duration: 14,
    minBorrowerScore: 1200,
    collateralMultiplier: 1.0,
    airdropSplit: 20,
    status: 'active',
    createdAt: new Date('2025-01-14'),
  },
  {
    id: 'listing-3',
    nft: mockNFTs[4], // Azuki
    lender: {
      address: '0x3E5e9111Ae8eB78Fe1CC3bb8915d5D461F3Ef9A9',
      score: getEthosScoreDetails(2450),
    },
    rentalFee: 0.35,
    duration: 5,
    minBorrowerScore: 1600,
    collateralMultiplier: 1.0,
    airdropSplit: 0,
    status: 'active',
    createdAt: new Date('2025-01-18'),
  },
  {
    id: 'listing-4',
    nft: mockNFTs[5], // Doodles
    lender: {
      address: '0x9876543210abcdef9876543210abcdef98765432',
      score: getEthosScoreDetails(950),
    },
    rentalFee: 0.2,
    duration: 10,
    minBorrowerScore: 800,
    collateralMultiplier: 1.2,
    airdropSplit: 0,
    status: 'active',
    createdAt: new Date('2025-01-16'),
  },
  {
    id: 'listing-5',
    nft: mockNFTs[6], // Mutant Ape
    lender: {
      address: '0xabcdef1234567890abcdef1234567890abcdef12',
      score: getEthosScoreDetails(1450),
    },
    rentalFee: 0.76,
    duration: 21,
    minBorrowerScore: 1200,
    collateralMultiplier: 1.0,
    airdropSplit: 10,
    status: 'active',
    createdAt: new Date('2025-01-12'),
  },
  {
    id: 'listing-6',
    nft: mockNFTs[7], // CloneX
    lender: {
      address: '0x1234567890abcdef1234567890abcdef12345678',
      score: getEthosScoreDetails(2600),
    },
    rentalFee: 0.88,
    duration: 30,
    minBorrowerScore: 2000,
    collateralMultiplier: 0.9,
    airdropSplit: 25,
    status: 'active',
    createdAt: new Date('2025-01-10'),
  },
];

// Mock active loans (for borrower dashboard)
export const mockActiveLoans: ActiveLoan[] = [
  {
    id: 'loan-1',
    listing: mockListings[0],
    borrower: {
      address: '0x742d35Cc6633C0532e3a0bCBr...595f80cEb',
      score: getEthosScoreDetails(2100),
    },
    collateralAmount: 2.25,
    startDate: new Date('2025-01-21'),
    returnDate: new Date('2025-01-25'),
    status: 'active',
  },
  {
    id: 'loan-2',
    listing: mockListings[1],
    borrower: {
      address: '0x742d35Cc6633C0532e3a0bCBr...595f80cEb',
      score: getEthosScoreDetails(2100),
    },
    collateralAmount: 3.0,
    startDate: new Date('2025-01-20'),
    returnDate: new Date('2025-01-27'),
    status: 'active',
  },
];

// Mock user profile
export const mockUserProfile: UserProfile = {
  address: '0x742d35Cc6633C0532e3a0bCBr...595f80cEb',
  score: getEthosScoreDetails(2100),
  totalBorrowed: 2.4,
  totalLent: 1.8,
  activeLoans: 2,
  totalLoans: 12,
  onTimeReturns: 12,
  lateReturns: 0,
  reviews: 28,
  memberSince: new Date('2024-01-01'),
};

// Mock recent activity
export const mockActivity: Activity[] = [
  {
    id: 'activity-1',
    type: 'return',
    description: 'Returned NFT On-Time - Bored Ape #7495',
    scoreChange: 50,
    timestamp: new Date('2025-01-18T14:30:00'),
  },
  {
    id: 'activity-2',
    type: 'listing_created',
    description: 'Created Listing - Cool Cat #4521',
    scoreChange: 2,
    timestamp: new Date('2025-01-14T10:15:00'),
  },
  {
    id: 'activity-3',
    type: 'borrow',
    description: 'Borrowed NFT - CryptoPunk #3100',
    timestamp: new Date('2025-01-13T16:45:00'),
  },
  {
    id: 'activity-4',
    type: 'score_boost',
    description: 'Reputation boost for consistent on-time returns',
    scoreChange: 25,
    timestamp: new Date('2025-01-10T09:00:00'),
  },
];
