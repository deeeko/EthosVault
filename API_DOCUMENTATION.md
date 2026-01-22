# EthosVault Backend API Documentation

## Overview

Complete backend API infrastructure for EthosVault NFT lending platform built with Next.js App Router, Iron Session authentication, and viem for on-chain interactions.

**Contract Address (Base Sepolia):** `0x000F93E9C5787F25Ac6FF697fa172257362afDB2`

---

## Authentication Flow

### 1. GET /api/auth/nonce

**Description:** Generate a nonce for SIWE (Sign-In with Ethereum) authentication

**Auth Required:** No

**Response:**
```json
{
  "nonce": "abc123..."
}
```

---

### 2. POST /api/auth/verify

**Description:** Verify SIWE signature and authenticate user. Automatically fetches Ethos score and stores in session.

**Auth Required:** No

**Request Body:**
```json
{
  "message": "...",  // SIWE message
  "signature": "0x..." // Signature from wallet
}
```

**Response:**
```json
{
  "success": true,
  "address": "0x...",
  "ethosScore": 1250,
  "ethosProfileId": 12345
}
```

---

### 3. GET /api/auth/me

**Description:** Get current authenticated user session data

**Auth Required:** Yes

**Response:**
```json
{
  "address": "0x...",
  "chainId": 84532,
  "isAuthenticated": true,
  "ethosScore": 1250,
  "ethosProfileId": 12345
}
```

**Error (401):**
```json
{
  "error": "Not authenticated"
}
```

---

### 4. POST /api/auth/logout

**Description:** Destroy user session

**Auth Required:** Yes

**Response:**
```json
{
  "success": true
}
```

---

## Marketplace APIs

### 5. GET /api/marketplace/listings

**Description:** Fetch all NFT listings from contract, enriched with Ethos data and NFT metadata

**Auth Required:** No (Public)

**Response:**
```json
{
  "success": true,
  "count": 5,
  "listings": [
    {
      "id": 0,
      "lender": "0x...",
      "nft": "0x...",
      "tokenId": "123",
      "available": true,
      "lenderEthosScore": 1500,
      "lenderEthosProfileId": 12345,
      "lenderDisplayName": "Alice",
      "lenderAvatarUrl": "https://...",
      "nftName": "Cool NFT #123",
      "nftCollection": "Cool Collection",
      "nftImage": "https://...",
      "floorPrice": 0.5
    }
  ]
}
```

**Features:**
- Fetches from contract's `getAllListings()`
- Enriches with lender's Ethos profile
- Fetches NFT metadata (image, name, floor price) from Alchemy
- Returns empty array if no listings

---

## Borrowing APIs

### 6. POST /api/borrow/calculate-collateral

**Description:** Calculate required collateral based on user's Ethos score and NFT floor price

**Auth Required:** Yes

**Request Body:**
```json
{
  "floorPriceEth": "0.5"  // Floor price in ETH
}
```

**Response:**
```json
{
  "success": true,
  "ethosScore": 1250,
  "floorPriceEth": 0.5,
  "collateralBps": 5536,  // Basis points (55.36%)
  "collateralEth": 0.2768,  // ETH amount
  "collateralWei": "276800000000000000",
  "collateralPercentage": 55.36
}
```

**Collateral Formula:**
- Score 0 → 100% collateral (10000 bps)
- Score 2800 (max) → 0% collateral (0 bps)
- Linear interpolation: `bps = 10000 - (score * 10000 / 2800)`

**Error Codes:**
- `401`: Not authenticated
- `400`: Invalid floor price

---

## Profile APIs

### 7. GET /api/profile/activity

**Description:** Get user's lending/borrowing activity history from contract events

**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "address": "0x...",
  "ethosScore": 1250,
  "activity": [
    {
      "type": "listed",
      "timestamp": 12345678,
      "nft": "0x...",
      "tokenId": "123",
      "listingId": "0"
    },
    {
      "type": "borrowed",
      "timestamp": 12345679,
      "loanId": "0",
      "listingId": "0",
      "collateral": "100000000000000000"
    },
    {
      "type": "repaid",
      "timestamp": 12345680,
      "loanId": "0"
    }
  ],
  "stats": {
    "totalListings": 5,
    "totalBorrows": 3,
    "totalRepayments": 2,
    "totalLiquidations": 0
  }
}
```

**Activity Types:**
- `listed`: NFT was listed for lending
- `borrowed`: Loan was requested and approved
- `repaid`: Loan was successfully repaid
- `liquidated`: Loan was liquidated by lender

---

## Ethos APIs (Existing)

### 8. GET /api/ethos/score

**Description:** Fetch Ethos score for a wallet address

**Parameters:**
- `address` (query): Wallet address

**Response:**
```json
{
  "success": true,
  "profile": {
    "score": 1250,
    "profileId": 12345,
    "displayName": "Alice",
    "avatarUrl": "https://...",
    ...
  }
}
```

---

## Session Management

**Session Cookie:** `ethosvault_session`

**Session Duration:** 7 days

**Session Data:**
```typescript
{
  address?: string;
  chainId?: number;
  isAuthenticated?: boolean;
  ethosScore?: number;
  ethosProfileId?: number;
  nonce?: string;
  siwe?: {
    address: string;
    chainId: number;
  };
}
```

---

## Error Handling

**Standard Error Response:**
```json
{
  "error": "Error message here"
}
```

**Common Status Codes:**
- `200`: Success
- `400`: Bad Request (invalid parameters)
- `401`: Unauthorized (not authenticated)
- `404`: Not Found
- `500`: Internal Server Error

---

## Contract Interaction Utilities

### Server-Side Contract Reading

**File:** `lib/contractServer.ts`

**Available Functions:**
- `getAllListingsFromContract()` - Get all listings
- `getListingById(listingId)` - Get specific listing
- `getLoanById(loanId)` - Get specific loan
- `getListingCounter()` - Total listings count
- `getLoanCounter()` - Total loans count
- `calculateCollateralFromScore(score)` - Contract collateral calculation
- `getContractEvents(eventName, fromBlock?)` - Fetch contract events

**Example:**
```typescript
import { getAllListingsFromContract } from '@/lib/contractServer';

const listings = await getAllListingsFromContract();
```

---

## Ethos Integration Utilities

### Server-Side Ethos API

**File:** `lib/ethosApiServer.ts`

**Available Functions:**
- `fetchEthosProfileServer(address)` - Fetch profile
- `calculateCollateralBps(score)` - Calculate collateral basis points
- `calculateCollateralAmount(floorPriceWei, score)` - Calculate collateral in wei
- `getEthosProfileUrl(profileId, address)` - Get profile URL

**Example:**
```typescript
import { fetchEthosProfileServer, calculateCollateralBps } from '@/lib/ethosApiServer';

const profile = await fetchEthosProfileServer('0x...');
const collateralBps = calculateCollateralBps(profile.profile?.score || 0);
```

---

## Frontend Integration

### Calling APIs from Frontend

**Example: Fetch Marketplace Listings**
```typescript
const response = await fetch('/api/marketplace/listings');
const data = await response.json();

if (data.success) {
  console.log(`Found ${data.count} listings`);
  console.log(data.listings);
}
```

**Example: Calculate Collateral**
```typescript
const response = await fetch('/api/borrow/calculate-collateral', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ floorPriceEth: '0.5' }),
});

const data = await response.json();
console.log(`Required collateral: ${data.collateralEth} ETH`);
```

**Example: Check Authentication**
```typescript
const response = await fetch('/api/auth/me');
if (response.ok) {
  const data = await response.json();
  console.log(`Logged in as ${data.address}`);
  console.log(`Ethos Score: ${data.ethosScore}`);
} else {
  console.log('Not authenticated');
}
```

---

## Testing with cURL

### Test Marketplace Listings
```bash
curl http://localhost:3000/api/marketplace/listings
```

### Test Authentication Status
```bash
curl -b cookies.txt http://localhost:3000/api/auth/me
```

### Test Collateral Calculation
```bash
curl -X POST http://localhost:3000/api/borrow/calculate-collateral \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"floorPriceEth": "0.5"}'
```

### Test Profile Activity
```bash
curl -b cookies.txt http://localhost:3000/api/profile/activity
```

---

## Environment Variables Required

```env
# Session
SESSION_SECRET=your_32_character_minimum_secret_here

# Contract
NEXT_PUBLIC_CONTRACT_ADDRESS=0x000F93E9C5787F25Ac6FF697fa172257362afDB2
NEXT_PUBLIC_CHAIN_ID=84532  # Base Sepolia testnet

# Alchemy
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key
NEXT_PUBLIC_ALCHEMY_RPC_URL=https://base-sepolia.g.alchemy.com/v2/your_key
NEXT_PUBLIC_ALCHEMY_BASE_MAINNET_RPC=https://base-mainnet.g.alchemy.com/v2/your_key

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

---

## Security Considerations

### Authentication
- ✅ Uses SIWE (Sign-In with Ethereum) for secure wallet-based auth
- ✅ Nonce-based replay attack prevention
- ✅ Iron Session for encrypted session storage
- ✅ HTTPOnly cookies (not accessible via JavaScript)
- ✅ Secure flag in production
- ✅ 7-day session expiration

### API Security
- ✅ Session validation on protected endpoints
- ✅ Input validation and sanitization
- ✅ Rate limiting (implement via middleware if needed)
- ✅ CORS configured for same-origin
- ✅ No sensitive data in responses

### Contract Interactions
- ✅ Read-only operations on server
- ✅ All writes done client-side with wallet signing
- ✅ Event-based activity tracking
- ✅ No private keys on server

---

## Next Steps

### To Implement (Future):
1. ⏳ `/api/lend/list` - Verify listing on backend after transaction
2. ⏳ `/api/borrow/request` - Verify loan request
3. ⏳ `/api/borrow/repay` - Verify repayment
4. ⏳ `/api/admin/slash` - Bad actor reputation slashing
5. ⏳ Rate limiting middleware
6. ⏳ Database for off-chain tracking (Prisma + PostgreSQL)
7. ⏳ Webhook endpoints for contract events
8. ⏳ Email/notification system

### Current Status:
- ✅ Authentication (SIWE + Ethos)
- ✅ Session management (Iron Session)
- ✅ Marketplace listings API
- ✅ Collateral calculation API
- ✅ Profile activity API
- ✅ Contract reading utilities
- ✅ Ethos integration utilities

---

**Ready for Production Testing!** 🚀
