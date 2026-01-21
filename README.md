# EthosVault - Reputation-Backed NFT Lending Platform

A modern, responsive Next.js application for lending and borrowing NFTs using Ethos Network reputation scores on Base blockchain.

## Features

- 🎨 **Beautiful Dark Theme** - Carefully crafted UI with gold accents and smooth animations
- 🔐 **Secure Escrow System** - Smart contract-based NFT custody with full ownership protection
- 📊 **Score-Based Collateral** - Dynamic collateral requirements based on Ethos reputation scores
- 🎮 **Full Utility Access** - Borrowers get complete NFT utility via wrapper tokens
- ⚡ **Instant Rewards** - Both parties earn +50 Ethos score on successful loans
- 📱 **Fully Responsive** - Optimized for mobile, tablet, and desktop

## Protocol Rules

### Ethos Score Levels & Collateral Requirements

| Level | Score Range | Collateral % | Badge Color |
|-------|-------------|--------------|-------------|
| Untrusted | 0-799 | 70% | Red |
| Questionable | 800-1199 | 60% | Orange |
| Neutral | 1200-1599 | 50% | Yellow |
| Reputable | 1600-1999 | 40% | Blue |
| Exemplary | 2000-2399 | 35% | Green |
| Revered | 2400-2800 | 30% | Teal |

### How It Works

1. **Lender Lists NFT** - Approves & transfers original NFT to escrow contract
2. **Borrower Requests** - Pays rental fee upfront + posts dynamic collateral
3. **Approval & Activation** - Escrow mints non-transferable wrapper token to borrower
4. **During Loan** - Borrower uses NFT via wrapper (full utility via metadata mirroring)
5. **Return & Rewards** - Wrapper returned → collateral refunded → both get +50 Ethos score

### Rights Summary

- **Lender**: Retains full ownership, receives airdrops (default), gets rental fees
- **Borrower**: Temporary usage only via wrapper, cannot sell/transfer, full utility access
- **Escrow**: Neutral automated enforcer, no discretion, executes rules only
- **Anti-Theft**: Wrapper non-transferable, attempts trigger liquidation + major Ethos slash

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Language**: TypeScript
- **Fonts**: DM Sans, Outfit (Google Fonts)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ethosvault.git
cd ethosvault
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
ethosvault/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with Header
│   ├── page.tsx           # Landing page
│   ├── globals.css        # Global styles
│   ├── marketplace/       # Marketplace page
│   ├── lend/             # Create listing wizard
│   ├── borrow/           # Borrower dashboard
│   └── profile/          # User profile
├── components/            # Reusable components
│   ├── Header.tsx        # Navigation header
│   ├── NFTCard.tsx       # NFT listing card
│   ├── ScoreBadge.tsx    # Ethos score badge
│   ├── RightsTooltip.tsx # Protocol rights info
│   └── ProtocolFlow.tsx  # How it works visualization
├── lib/                   # Utilities and constants
│   ├── constants.ts      # Protocol rules & mock data
│   └── utils.ts          # Helper functions
├── public/               # Static assets
├── tailwind.config.js    # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies
```

## Pages Overview

### Home (/)
- Hero section with value proposition
- Feature cards
- Protocol flow visualization
- Statistics dashboard

### Marketplace (/marketplace)
- Browse NFT listings
- Advanced filters (score, fee, duration)
- Search functionality
- Listing cards with lender scores

### Lend (/lend)
- Multi-step wizard (3 steps)
- Step 1: Select NFT from wallet
- Step 2: Set rental terms (fee, duration, min score, collateral multiplier, airdrop split)
- Step 3: Review and approve escrow transfer

### Borrow (/borrow)
- Active loans dashboard
- Stats cards (active loans, total locked, score, on-time returns)
- Loan cards with countdown timers
- Return NFT functionality
- Borrowing tips

### Profile (/profile)
- User stats and wallet address
- Large Ethos score display with badge
- Score progress bar (0-2800)
- Score levels legend
- Recent activity timeline
- Reputation building tips

## Key Components

### ScoreBadge
Color-coded badges for Ethos scores with proper level indicators.

### NFTCard
Compact, responsive cards for NFT listings with hover effects.

### RightsTooltip
Informative tooltip explaining protocol rights and anti-theft measures.

### ProtocolFlow
Visual step-by-step guide showing how the lending process works.

## Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme:
- `gold`: Primary accent color
- `ethos.*`: Score level colors
- `dark.*`: Background and text colors

### Animations
Modify animation timing in `app/globals.css` and component-level Framer Motion configs.

### Mock Data
Update mock data in `lib/constants.ts` to test with different scenarios.

## Future Enhancements

- [ ] Smart contract integration (Ethos Network, Base blockchain)
- [ ] Wallet connection (RainbowKit, wagmi)
- [ ] Real-time price feeds (Chainlink oracles)
- [ ] NFT image rendering (IPFS, OpenSea API)
- [ ] Transaction history
- [ ] Advanced analytics dashboard
- [ ] Notification system
- [ ] Dark/light theme toggle

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Acknowledgments

- Ethos Network for reputation infrastructure
- Base blockchain for L2 scalability
- Tailwind CSS and Framer Motion for amazing developer experience

---

Built with ❤️ for the NFT community
