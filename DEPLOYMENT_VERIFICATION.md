# 🚀 Deployment Verification Guide

## ✅ Verify Backend is Deployed

### 1. Check API Health Endpoint

**Visit this URL in your browser:**
```
https://your-app.vercel.app/api/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-01-22T...",
  "version": "1.0.0",
  "backend": "deployed",
  "apis": {
    "marketplace": "/api/marketplace/listings",
    "collateral": "/api/borrow/calculate-collateral",
    "activity": "/api/profile/activity",
    "auth": "/api/auth/me"
  }
}
```

✅ If you see this, backend is deployed!
❌ If you get 404, backend didn't deploy - check Vercel logs

---

### 2. Check Marketplace API

**Visit:**
```
https://your-app.vercel.app/api/marketplace/listings
```

**Expected Response:**
```json
{
  "success": true,
  "count": 0,
  "listings": []
}
```

✅ Backend is working!
❌ If error, check environment variables in Vercel

---

## ✅ Verify UI Changes

### 1. Clear Browser Cache

**Important!** Vercel uses aggressive caching. You MUST clear cache:

**Chrome/Edge:**
1. Press `Ctrl + Shift + Delete`
2. Select "Cached images and files"
3. Click "Clear data"

**Or do a hard refresh:**
- `Ctrl + Shift + R` (Windows)
- `Cmd + Shift + R` (Mac)

---

### 2. Check Landing Page

**Visit:**
```
https://your-app.vercel.app/
```

**Scroll to "How It Works" section**

**What to check:**
- ✅ Steps should have proper spacing
- ✅ Cards should NOT be squeezed together
- ✅ On mobile: 1 column layout
- ✅ On tablet: 2 column layout
- ✅ On desktop: 5 column layout
- ✅ Icons should be larger (20x20 on desktop)
- ✅ Cards should have min height of 280px

---

## 🔧 If Backend Didn't Deploy

### Check Vercel Dashboard

1. **Go to:** https://vercel.com/dashboard
2. **Click your project** (ethosvault)
3. **Click latest deployment**
4. **Check "Building" tab for errors**

### Common Issues:

**Issue 1: Environment Variables Missing**

Vercel needs these variables set:

```env
SESSION_SECRET=your_secret_here_32_chars_minimum
NEXT_PUBLIC_CONTRACT_ADDRESS=0x000F93E9C5787F25Ac6FF697fa172257362afDB2
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_ALCHEMY_API_KEY=ANrZfAa0b-VSnJVxzsYuw
NEXT_PUBLIC_ALCHEMY_RPC_URL=https://base-sepolia.g.alchemy.com/v2/ANrZfAa0b-VSnJVxzsYuw
NEXT_PUBLIC_ALCHEMY_BASE_MAINNET_RPC=https://base-mainnet.g.alchemy.com/v2/ANrZfAa0b-VSnJVxzsYuw
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=0c3e872b65f2fc8f860f94b6dd9fbba9
```

**How to add in Vercel:**
1. Go to Project Settings
2. Click "Environment Variables"
3. Add each variable
4. Click "Redeploy" to trigger new deployment

---

**Issue 2: Build Failed**

Check build logs in Vercel dashboard. Look for:
- TypeScript errors
- Missing dependencies
- Import errors

---

**Issue 3: UI Not Updating**

This is usually browser cache:
1. Clear browser cache (Ctrl + Shift + Delete)
2. Hard refresh (Ctrl + Shift + R)
3. Try incognito mode
4. Check if `/api/health` shows new version

---

## 🧪 Full Verification Checklist

Run through this checklist:

### Backend APIs:
- [ ] `/api/health` returns healthy status
- [ ] `/api/marketplace/listings` returns JSON
- [ ] `/api/auth/me` returns 401 (not authenticated)
- [ ] `/api/borrow/calculate-collateral` returns 401 (auth required)
- [ ] `/api/profile/activity` returns 401 (auth required)

### Frontend:
- [ ] Landing page loads without errors
- [ ] "How It Works" section has proper spacing
- [ ] Steps are not squeezed together
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Icons and text are readable sizes
- [ ] Cards have consistent heights

### Authentication Flow:
- [ ] Can connect wallet
- [ ] Can sign SIWE message
- [ ] `/api/auth/me` returns session data after login
- [ ] Session persists across page reloads

---

## 🐛 Debugging Commands

### Test Backend Locally:
```bash
# In your project folder
npm run dev

# Visit in browser:
http://localhost:3000/api/health
http://localhost:3000/api/marketplace/listings
```

### Test Production:
```bash
# Replace with your Vercel URL
curl https://your-app.vercel.app/api/health
curl https://your-app.vercel.app/api/marketplace/listings
```

---

## 📊 What Should Be Working Now

### ✅ Backend (New):
- Complete API infrastructure
- Marketplace listings with Ethos enrichment
- Collateral calculation
- Profile activity tracking
- Session management with Ethos scores
- Health check endpoint

### ✅ Frontend (Fixed):
- Landing page UI spacing improved
- ProtocolFlow component responsive
- Better card design and spacing
- Connection lines between steps
- Larger icons and text

---

## 🆘 Still Having Issues?

### 1. Check Vercel Logs:
```
Vercel Dashboard → Your Project → Latest Deployment → View Function Logs
```

### 2. Check Browser Console:
```
Press F12 → Console tab
Look for errors
```

### 3. Verify Git Push:
```bash
cd "c:\Users\DEL\Documents\FINALETHOSVAULT 1--\ethosvault\ethosvault"
git log --oneline -3

# Should show:
# 83fd984 Add API health check endpoint
# 04d83ae Add complete backend API infrastructure...
```

### 4. Manual Redeploy:
```
Vercel Dashboard → Your Project → Deployments → Redeploy
```

---

## ✨ Success Indicators

**You'll know it's working when:**

1. ✅ `/api/health` shows `"backend": "deployed"`
2. ✅ `/api/marketplace/listings` returns JSON
3. ✅ Landing page steps have proper spacing
4. ✅ No console errors in browser
5. ✅ UI is responsive on all screen sizes

---

**If all checks pass, you're good to go!** 🎉
