# 🔧 Vercel Environment Variables Setup

## ⚠️ CRITICAL: Backend Won't Work Without These

Your backend APIs are returning 404 because Vercel doesn't have the environment variables set.

---

## 📋 Required Environment Variables

Go to your Vercel project settings and add these:

### 1. Go to Vercel Dashboard
```
https://vercel.com/dashboard
```

### 2. Click Your Project
Find "ethosvault" or your project name

### 3. Go to Settings → Environment Variables

### 4. Add These Variables:

**Copy these EXACTLY from your `.env.local` file:**

```env
# Session Security (REQUIRED)
SESSION_SECRET=super_secret_random_string_32_chars_minimum_here_123456789

# Contract Configuration (REQUIRED)
NEXT_PUBLIC_CONTRACT_ADDRESS=0x000F93E9C5787F25Ac6FF697fa172257362afDB2
NEXT_PUBLIC_CHAIN_ID=84532

# Alchemy API (REQUIRED for NFT metadata)
NEXT_PUBLIC_ALCHEMY_API_KEY=ANrZfAa0b-VSnJVxzsYuw
NEXT_PUBLIC_ALCHEMY_RPC_URL=https://base-sepolia.g.alchemy.com/v2/ANrZfAa0b-VSnJVxzsYuw
NEXT_PUBLIC_ALCHEMY_BASE_MAINNET_RPC=https://base-mainnet.g.alchemy.com/v2/ANrZfAa0b-VSnJVxzsYuw

# WalletConnect (REQUIRED for wallet connection)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=0c3e872b65f2fc8f860f94b6dd9fbba9
```

---

## ✅ How to Add in Vercel

For **EACH** variable above:

1. Click "Add New" button
2. **Key**: Enter the variable name (e.g., `SESSION_SECRET`)
3. **Value**: Enter the value (copy from your `.env.local`)
4. **Environment**: Select **all environments** (Production, Preview, Development)
5. Click "Save"

**Repeat for all 7 variables!**

---

## 🚀 After Adding Variables

### Step 1: Trigger Redeploy

1. Stay in Vercel Dashboard
2. Go to "Deployments" tab
3. Click the three dots (...) on the latest deployment
4. Click "Redeploy"
5. Confirm "Redeploy"

**Wait 2-3 minutes for build to complete**

---

### Step 2: Verify Deployment

Once deployment shows "Ready":

**Test Backend Health:**
```
https://your-app.vercel.app/api/health
```

**Should return:**
```json
{
  "status": "healthy",
  "backend": "deployed",
  ...
}
```

**Test Marketplace API:**
```
https://your-app.vercel.app/api/marketplace/listings
```

**Should return:**
```json
{
  "success": true,
  "count": 0,
  "listings": []
}
```

---

## 🐛 If Still Getting 404

### Check Build Logs:

1. Vercel Dashboard → Your Project
2. Click latest deployment
3. Click "Building" tab
4. Look for errors

### Common Issues:

**Issue 1: TypeScript Errors**
- Build will fail if there are TS errors
- Check the "Building" logs for red errors

**Issue 2: Missing Dependencies**
- Make sure `package.json` is up to date
- All imports should resolve

**Issue 3: Wrong API Route Path**
- Make sure URL matches file structure
- `/api/health` → `app/api/health/route.ts` ✅

---

## 📊 Verification Checklist

After redeploying with environment variables:

- [ ] All 7 env variables added in Vercel
- [ ] Redeployed (not just pushed code)
- [ ] Build shows "Ready" status
- [ ] `/api/health` returns JSON (not 404)
- [ ] `/api/marketplace/listings` returns JSON
- [ ] Landing page loads correctly
- [ ] No errors in browser console

---

## 🎯 Quick Test Commands

```bash
# Replace with your actual Vercel URL

# Test health
curl https://your-app.vercel.app/api/health

# Test marketplace
curl https://your-app.vercel.app/api/marketplace/listings

# Test auth (should return 401)
curl https://your-app.vercel.app/api/auth/me
```

**All should return JSON, NOT HTML 404 page**

---

## ⚡ Pro Tips

1. **Always test locally first:**
   ```bash
   npm run dev
   # Then visit http://localhost:3000/api/health
   ```

2. **Use Vercel CLI for easier deployment:**
   ```bash
   npm i -g vercel
   vercel --prod
   ```

3. **Check function logs:**
   ```
   Vercel Dashboard → Deployments → Click deployment → Functions tab
   ```

4. **Environment variable naming:**
   - `NEXT_PUBLIC_*` variables are exposed to browser
   - Others (like `SESSION_SECRET`) are server-only
   - Both types need to be set in Vercel!

---

## 🆘 Still Not Working?

### Option 1: Manual Check

1. Go to Vercel → Your Project → Settings → Environment Variables
2. Count: Should have exactly 7 variables
3. Check each value matches your `.env.local`
4. Make sure "Production" is checked for each

### Option 2: Redeploy from Scratch

1. Delete all environment variables in Vercel
2. Re-add them one by one (copy-paste from `.env.local`)
3. Go to Deployments
4. Click "Redeploy" on latest deployment
5. Wait for build to complete
6. Test `/api/health`

### Option 3: Check Deployment Logs

```
Vercel Dashboard → Deployments → Latest → Building tab

Look for:
✅ "Build Completed"
❌ "Build Failed" (check error messages)
```

---

**Once all environment variables are set and you redeploy, the backend will work!** 🎉
