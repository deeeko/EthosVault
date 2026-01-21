# EthosVault - Setup & Customization Guide

## Quick Start

1. **Extract the project**:
   ```bash
   unzip ethosvault.zip
   cd ethosvault
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**: Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure Explained

```
ethosvault/
├── app/                      # Next.js 14 App Router
│   ├── layout.tsx           # Root layout with Header component
│   ├── page.tsx             # Landing page with hero, features, stats
│   ├── globals.css          # Tailwind + custom CSS animations
│   ├── marketplace/page.tsx # NFT listing marketplace with filters
│   ├── lend/page.tsx        # 3-step listing creation wizard
│   ├── borrow/page.tsx      # Borrower dashboard with active loans
│   └── profile/page.tsx     # User profile with score visualization
│
├── components/              # Reusable React components
│   ├── Header.tsx          # Sticky navigation with centered links
│   ├── NFTCard.tsx         # Compact NFT listing card
│   ├── ScoreBadge.tsx      # Color-coded Ethos score badge
│   ├── RightsTooltip.tsx   # Protocol rights information tooltip
│   ├── ProtocolFlow.tsx    # 5-step process visualization
│   ├── Modal.tsx           # Reusable modal component
│   └── index.ts            # Component exports
│
├── lib/                     # Utilities and constants
│   ├── constants.ts        # Protocol rules, Ethos levels, mock data
│   └── utils.ts            # Helper functions (formatting, etc.)
│
├── public/                  # Static assets (add your logos/images here)
│
└── Configuration files
    ├── package.json         # Dependencies
    ├── tailwind.config.js   # Custom theme, colors, animations
    ├── tsconfig.json        # TypeScript configuration
    ├── next.config.js       # Next.js configuration
    ├── postcss.config.js    # PostCSS for Tailwind
    ├── .gitignore          # Git ignore patterns
    └── .env.example        # Environment variables template
```

## Customization Guide

### 1. Colors & Branding

**File**: `tailwind.config.js`

```javascript
colors: {
  gold: {
    DEFAULT: '#D4AF37',  // Primary accent
    light: '#E8D090',
    dark: '#B8941F',
  },
  ethos: {
    untrusted: '#EF4444',      // Red (0-799)
    questionable: '#F97316',   // Orange (800-1199)
    neutral: '#EAB308',        // Yellow (1200-1599)
    reputable: '#3B82F6',      // Blue (1600-1999)
    exemplary: '#10B981',      // Green (2000-2399)
    revered: '#14B8A6',        // Teal (2400-2800)
  },
  // ... customize these to match your brand
}
```

### 2. Fonts

**File**: `app/globals.css`

Currently using DM Sans (body) and Outfit (headings) from Google Fonts.

To change fonts:
1. Update the `@import` URL at the top of `globals.css`
2. Update `fontFamily` in `tailwind.config.js`:
   ```javascript
   fontFamily: {
     sans: ['Your Body Font', 'system-ui', 'sans-serif'],
     display: ['Your Display Font', 'system-ui', 'sans-serif'],
   }
   ```

### 3. Protocol Rules

**File**: `lib/constants.ts`

All Ethos score levels and protocol logic are defined here:

```typescript
export const ETHOS_SCORE_LEVELS = {
  UNTRUSTED: { min: 0, max: 799, label: 'Untrusted', color: '#EF4444', collateral: 70 },
  // ... modify ranges, labels, or collateral percentages
}

export const MAX_ETHOS_SCORE = 2800; // Adjust max score

export const SCORE_BOOST = {
  TIMELY_RETURN: 50,      // Score boost for on-time returns
  SUCCESSFUL_LEND: 50,    // Score boost for successful lending
  DEFAULT_SLASH: 0.5,     // Slash score in half on default
};
```

### 4. Mock Data

**File**: `lib/constants.ts`

Replace mock data with real blockchain data:

- `MOCK_LISTINGS`: NFT listings from your marketplace
- `MOCK_USER_NFTS`: User's wallet NFTs
- `MOCK_ACTIVE_LOANS`: Active borrowing positions
- `MOCK_USER`: Current user data
- `MOCK_ACTIVITY`: Recent transactions

### 5. Animations

**Global animations** (`app/globals.css`):
- `animate-glow`: Pulsing glow effect
- `animate-slide-up`: Entrance animation
- `animate-fade-in`: Fade in transition
- `animate-float`: Floating effect

**Component-level** (using Framer Motion):
- Staggered list animations
- Page transitions
- Hover effects

Adjust timing and easing in component files.

### 6. Header Navigation

**File**: `components/Header.tsx`

Modify navigation links:
```typescript
const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/marketplace', label: 'Marketplace' },
  // ... add or remove links
];
```

Logo customization:
- Replace the `<div>` logo with your own SVG/image
- Update colors in the gradient

### 7. Responsive Design

All components are responsive by default using Tailwind's mobile-first approach:

- `sm:` - 640px and up (mobile landscape)
- `md:` - 768px and up (tablets)
- `lg:` - 1024px and up (desktop)
- `xl:` - 1280px and up (large desktop)

Example from marketplace:
```jsx
<div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
  {/* 1 column on mobile, 2 on tablet, 3 on desktop */}
</div>
```

## Adding New Features

### Adding a New Page

1. Create file in `app/your-page/page.tsx`:
```typescript
'use client';

export default function YourPage() {
  return (
    <div className="container mx-auto px-4 lg:px-8 py-8">
      <h1 className="text-3xl font-display font-bold">
        Your <span className="text-gradient">Page</span>
      </h1>
      {/* Your content */}
    </div>
  );
}
```

2. Add to navigation in `components/Header.tsx`

### Creating a New Component

1. Create file in `components/YourComponent.tsx`
2. Export from `components/index.ts`
3. Import where needed: `import { YourComponent } from '@/components';`

### Using the Modal

```typescript
import { Modal } from '@/components';

const [isOpen, setIsOpen] = useState(false);

<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Modal Title">
  <p>Your content here</p>
</Modal>
```

## Blockchain Integration

When ready to connect to real blockchain:

1. **Install wallet libraries**:
   ```bash
   npm install wagmi viem @rainbow-me/rainbowkit
   ```

2. **Set up environment variables**:
   - Copy `.env.example` to `.env.local`
   - Fill in your contract addresses and API keys

3. **Update data fetching**:
   - Replace mock data in `lib/constants.ts`
   - Use wagmi hooks for contract interactions
   - Integrate Chainlink for floor prices

4. **Key integration points**:
   - Lend page: Approve NFT → Transfer to escrow
   - Marketplace: Fetch active listings from contract
   - Borrow page: Request loan → Pay fee + collateral
   - Profile: Fetch Ethos score from contract

## Performance Optimization

### Production Build

```bash
npm run build
npm start
```

### Image Optimization

Add NFT images to `public/` directory and use Next.js Image component:
```typescript
import Image from 'next/image';

<Image src="/nft-placeholder.png" alt="NFT" width={300} height={300} />
```

### Code Splitting

Next.js automatically code-splits by route. For heavy components:
```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'));
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project to Vercel
3. Auto-deploys on every push

### Other Platforms

```bash
npm run build
# Deploy the `.next` folder
```

## Troubleshooting

### Port Already in Use
```bash
# Change port
npm run dev -- -p 3001
```

### TypeScript Errors
```bash
# Rebuild types
rm -rf .next
npm run dev
```

### Styles Not Loading
```bash
# Clear cache
rm -rf .next
npm install
npm run dev
```

## Support & Resources

- Next.js Docs: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- Framer Motion: https://www.framer.com/motion/
- Ethos Network: https://ethos.network/

## Next Steps

1. ✅ Run the development server
2. ✅ Explore all pages and features
3. 🔄 Customize colors and branding
4. 🔄 Replace mock data with your data
5. 🔄 Integrate blockchain contracts
6. 🔄 Add wallet connection
7. 🔄 Test on mobile devices
8. 🚀 Deploy to production

---

Happy building! 🚀
