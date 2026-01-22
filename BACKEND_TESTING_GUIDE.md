# EthosVault Backend Testing Guide

## Quick Start Testing

### Prerequisites
```bash
# 1. Ensure dev server is running
cd "c:\Users\DEL\Documents\FINALETHOSVAULT 1--\ethosvault\ethosvault"
npm run dev

# 2. Server should be running at http://localhost:3000
```

---

## Test Suite 1: Public APIs (No Auth Required)

### Test 1: Get Marketplace Listings

**Browser Test:**
```
Open: http://localhost:3000/api/marketplace/listings
```

**cURL Test:**
```bash
curl http://localhost:3000/api/marketplace/listings
```

**Expected Response:**
```json
{
  "success": true,
  "count": 0,
  "listings": []
}
```

**Note:** Count will be 0 until you list an NFT from the frontend.

---

### Test 2: Get Nonce for Authentication

**Browser Test:**
```
Open: http://localhost:3000/api/auth/nonce
```

**cURL Test:**
```bash
curl http://localhost:3000/api/auth/nonce
```

**Expected Response:**
```json
{
  "nonce": "abc123randomstring..."
}
```

---

## Test Suite 2: Authentication Flow

### Test 3: Check Auth Status (Before Login)

**Browser Test:**
```
Open: http://localhost:3000/api/auth/me
```

**cURL Test:**
```bash
curl http://localhost:3000/api/auth/me
```

**Expected Response (401 Unauthorized):**
```json
{
  "error": "Not authenticated"
}
```

---

### Test 4: Complete SIWE Authentication

**Method:** Use Frontend

1. **Open Frontend:**
   ```
   http://localhost:3000
   ```

2. **Click "Connect Wallet" Button**
   - MetaMask will prompt
   - Select your wallet
   - Approve connection

3. **Sign Message**
   - You'll be asked to sign a SIWE message
   - Click "Sign" in MetaMask

4. **Verify Success:**
   - Check browser console (F12)
   - Look for: "✅ User authenticated"
   - Should see your address and Ethos score

**Console Output:**
```
[Auth] User authenticated: {
  address: "0x...",
  ethosScore: 1250,
  ethosProfileId: 12345
}
```

---

### Test 5: Check Auth Status (After Login)

**Browser Test:**
```
Open: http://localhost:3000/api/auth/me
```

**Expected Response:**
```json
{
  "address": "0xYourWalletAddress",
  "chainId": 84532,
  "isAuthenticated": true,
  "ethosScore": 1250,
  "ethosProfileId": 12345
}
```

**Note:** `ethosScore` will be 0 if you don't have an Ethos profile yet.

---

## Test Suite 3: Protected APIs (Auth Required)

### Test 6: Calculate Collateral

**Method:** cURL with Session Cookie

**Step 1: Save cookies during login**
```bash
# Use browser dev tools → Application → Cookies
# Copy the 'ethosvault_session' cookie value
```

**Step 2: Test with cURL**
```bash
curl -X POST http://localhost:3000/api/borrow/calculate-collateral \
  -H "Content-Type: application/json" \
  -H "Cookie: ethosvault_session=YOUR_COOKIE_VALUE_HERE" \
  -d '{"floorPriceEth": "0.5"}'
```

**Expected Response:**
```json
{
  "success": true,
  "ethosScore": 1250,
  "floorPriceEth": 0.5,
  "collateralBps": 5536,
  "collateralEth": 0.2768,
  "collateralWei": "276800000000000000",
  "collateralPercentage": 55.36
}
```

**Understanding the Response:**
- Your Ethos score is 1250 (out of 2800 max)
- For a 0.5 ETH floor price NFT
- You need 55.36% collateral = 0.2768 ETH
- Higher Ethos score → Lower collateral required

---

### Test 7: Get Profile Activity

**Browser Test (After Login):**
```
Open: http://localhost:3000/api/profile/activity
```

**cURL Test:**
```bash
curl -H "Cookie: ethosvault_session=YOUR_COOKIE_VALUE" \
  http://localhost:3000/api/profile/activity
```

**Expected Response:**
```json
{
  "success": true,
  "address": "0x...",
  "ethosScore": 1250,
  "activity": [],
  "stats": {
    "totalListings": 0,
    "totalBorrows": 0,
    "totalRepayments": 0,
    "totalLiquidations": 0
  }
}
```

**Note:** Activity array will be empty until you perform transactions.

---

## Test Suite 4: End-to-End Flow Testing

### Test 8: List an NFT → See on Marketplace

**Step 1: List NFT from Frontend**
1. Go to `/lend` page
2. Connect wallet (if not already)
3. Select an NFT you own
4. Click "Next" → Set terms → "Create Listing"
5. **Two Wallet Prompts:**
   - First: "Approve NFT" → Confirm
   - Second: "List NFT" → Confirm
6. Wait for transaction confirmation

**Step 2: Check Backend Console**
```
Look for logs in your terminal:
[Auth] User authenticated: {...}
```

**Step 3: Refresh Marketplace API**
```
Open: http://localhost:3000/api/marketplace/listings
```

**Expected Response (After Listing):**
```json
{
  "success": true,
  "count": 1,
  "listings": [
    {
      "id": 0,
      "lender": "0xYourAddress",
      "nft": "0xNFTContractAddress",
      "tokenId": "123",
      "available": true,
      "lenderEthosScore": 1250,
      "lenderEthosProfileId": 12345,
      "lenderDisplayName": "YourName",
      "nftName": "Cool NFT #123",
      "nftCollection": "Cool Collection",
      "nftImage": "https://...",
      "floorPrice": 0.5
    }
  ]
}
```

---

### Test 9: Calculate Collateral for Borrowing

**Step 1: Get a Listing Floor Price**
```bash
# From marketplace API response above, note the floorPrice
# Example: "floorPrice": 0.5
```

**Step 2: Calculate Required Collateral**
```bash
curl -X POST http://localhost:3000/api/borrow/calculate-collateral \
  -H "Content-Type: application/json" \
  -H "Cookie: ethosvault_session=YOUR_COOKIE_VALUE" \
  -d '{"floorPriceEth": "0.5"}'
```

**Step 3: Verify Calculation**
```json
{
  "success": true,
  "ethosScore": 1250,
  "collateralEth": 0.2768,
  "collateralPercentage": 55.36
}
```

**Manual Verification:**
```
Score: 1250 / 2800 = 44.64% score achieved
Collateral: 100% - 44.64% = 55.36% required ✅
Amount: 0.5 ETH × 55.36% = 0.2768 ETH ✅
```

---

### Test 10: Check Activity After Listing

**Step 1: List NFT (from Test 8)**

**Step 2: Wait 5-10 seconds for events to index**

**Step 3: Fetch Activity**
```
Open: http://localhost:3000/api/profile/activity
```

**Expected Response:**
```json
{
  "success": true,
  "address": "0x...",
  "activity": [
    {
      "type": "listed",
      "timestamp": 12345678,
      "nft": "0x...",
      "tokenId": "123",
      "listingId": "0"
    }
  ],
  "stats": {
    "totalListings": 1,
    "totalBorrows": 0,
    "totalRepayments": 0,
    "totalLiquidations": 0
  }
}
```

---

## Test Suite 5: Error Handling

### Test 11: Invalid Collateral Calculation

**Missing Floor Price:**
```bash
curl -X POST http://localhost:3000/api/borrow/calculate-collateral \
  -H "Content-Type: application/json" \
  -H "Cookie: ethosvault_session=YOUR_COOKIE_VALUE" \
  -d '{}'
```

**Expected Error (400):**
```json
{
  "error": "Invalid floor price"
}
```

---

### Test 12: Unauthenticated Access

**Try accessing protected endpoint without login:**
```bash
curl -X POST http://localhost:3000/api/borrow/calculate-collateral \
  -H "Content-Type: application/json" \
  -d '{"floorPriceEth": "0.5"}'
```

**Expected Error (401):**
```json
{
  "error": "Not authenticated"
}
```

---

## Test Suite 6: Ethos Integration

### Test 13: Fetch Ethos Score

**Method:** Browser or cURL

```bash
curl "http://localhost:3000/api/ethos/score?address=0xYourWalletAddress"
```

**Expected Response:**
```json
{
  "success": true,
  "profile": {
    "score": 1250,
    "profileId": 12345,
    "displayName": "Alice",
    "avatarUrl": "https://...",
    "username": "alice",
    "status": "ACTIVE",
    "verified": true
  }
}
```

**If No Ethos Profile:**
```json
{
  "success": false,
  "profile": null,
  "error": "No Ethos profile found for this address"
}
```

---

## Debugging Tips

### Check Server Logs

**Look for these logs in terminal:**
```
[Auth] User authenticated: {...}
[Marketplace API] Fetching all listings
[Marketplace API] Found X listings
[Borrow API] Collateral calculated: {...}
[Profile API] Fetching activity for: 0x...
[Ethos API] Fetching profile for: 0x...
```

---

### Browser DevTools Console

**Open F12 → Console tab**

**Look for:**
```
🔗 Connected to: Base Sepolia (testnet)
🔗 Chain ID: 84532
🔗 RPC: Alchemy

📊 Marketplace Contract State: {
  isError: false,
  listingsCount: 1,
  hasListings: true
}
```

---

### Common Issues & Fixes

**Issue 1: "Not authenticated" on /api/auth/me**
- **Cause:** No active session
- **Fix:** Connect wallet from frontend first

**Issue 2: "Failed to fetch listings"**
- **Cause:** Contract not deployed or wrong address
- **Fix:** Verify `NEXT_PUBLIC_CONTRACT_ADDRESS` in .env.local

**Issue 3: "No Ethos profile found"**
- **Cause:** Address doesn't have Ethos profile
- **Fix:** Create profile at https://app.ethos.network

**Issue 4: Marketplace listings returns 0**
- **Cause:** No NFTs listed yet
- **Fix:** List an NFT from /lend page first

**Issue 5: Session cookie not persisting**
- **Cause:** Incorrect SESSION_SECRET
- **Fix:** Verify SESSION_SECRET in .env.local is at least 32 characters

---

## Performance Testing

### Test Concurrent Requests

**Marketplace Listings (10 concurrent):**
```bash
for i in {1..10}; do
  curl http://localhost:3000/api/marketplace/listings &
done
wait
```

**Expected:** All requests succeed within 1-2 seconds

---

## Security Testing

### Test 1: Session Hijacking Prevention

**Try using expired/invalid cookie:**
```bash
curl -H "Cookie: ethosvault_session=invalid_cookie_value" \
  http://localhost:3000/api/auth/me
```

**Expected:** 401 Unauthorized

---

### Test 2: CSRF Protection

**Iron Session provides CSRF protection automatically**

- Cookies are HttpOnly (not accessible via JavaScript)
- SameSite policy prevents cross-site requests
- Nonce-based SIWE prevents replay attacks

---

## Next Steps After Testing

### ✅ If All Tests Pass:

1. **Deploy to Production**
   - Update contract to Base Mainnet
   - Update `.env.local` with mainnet values
   - Deploy to Vercel/Railway

2. **Integrate with Frontend**
   - Use `/api/marketplace/listings` in marketplace page
   - Use `/api/borrow/calculate-collateral` in borrow flow
   - Use `/api/profile/activity` in profile page

3. **Monitor Performance**
   - Set up logging (Sentry, LogRocket)
   - Monitor API response times
   - Track error rates

---

## Testing Checklist

- [ ] ✅ Public APIs work without auth
- [ ] ✅ Authentication flow completes successfully
- [ ] ✅ Session persists across page reloads
- [ ] ✅ Protected APIs require authentication
- [ ] ✅ Marketplace listings fetch correctly
- [ ] ✅ Collateral calculation is accurate
- [ ] ✅ Profile activity tracks events
- [ ] ✅ Ethos integration works
- [ ] ✅ Error handling returns correct status codes
- [ ] ✅ Contract interactions succeed
- [ ] ✅ NFT metadata fetches correctly
- [ ] ✅ Server logs show expected output

---

**All tests passing? You're ready for production! 🚀**
