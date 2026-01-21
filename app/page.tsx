'use client';

import Link from 'next/link';
import { ArrowRight, Shield, TrendingUp, Users, Zap } from 'lucide-react';
import { ProtocolFlow } from '@/components/ProtocolFlow';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-7xl space-y-16 sm:space-y-20">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-8 py-12"
      >
        {/* Powered by Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-gold/10 via-gold/5 to-transparent border border-gold/20 backdrop-blur-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-gold">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" />
              <path d="M2 17L12 22L22 17L12 12L2 17Z" opacity="0.7" />
              <path d="M2 12L12 17L22 12" opacity="0.5" />
            </svg>
            <span className="text-sm font-medium text-gold">
              Powered by Ethos Network on Base
            </span>
          </div>
        </motion.div>

        <div className="relative inline-block">
          <div className="absolute inset-0 bg-gold blur-3xl opacity-20 animate-pulse"></div>
          <h1 className="relative text-5xl md:text-7xl font-display font-bold">
            <span className="text-dark-text">Borrow NFTs with</span>
            <br />
            <span className="text-gradient">Your Reputation</span>
          </h1>
        </div>
        
        <p className="text-xl text-dark-muted max-w-2xl mx-auto">
          Lend and borrow NFTs with confidence using Ethos Network reputation scores. 
          Full utility, zero trust required.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/marketplace" className="btn-primary flex items-center gap-2">
            Browse Marketplace
            <ArrowRight size={18} />
          </Link>
          <Link href="/lend" className="btn-secondary">
            List Your NFT
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto pt-8">
          {[
            { label: 'Total Value Locked', value: '247 ETH' },
            { label: 'Active Listings', value: '1,234' },
            { label: 'Trusted Lenders', value: '892' },
            { label: 'Avg Ethos Score', value: '1,650' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * i, duration: 0.4 }}
              className="stat-card p-4 sm:p-6"
            >
              <p className="text-xl sm:text-2xl font-bold text-gold mb-1">{stat.value}</p>
              <p className="text-xs sm:text-sm text-dark-muted">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Features */}
      <section className="space-y-8">
        <h2 className="text-3xl font-display font-bold text-center text-dark-text">
          Why <span className="text-gradient">EthosVault?</span>
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            {
              icon: Shield,
              title: 'Secure Escrow',
              description: 'Your NFTs are locked in audited smart contracts. Full ownership protection.',
            },
            {
              icon: TrendingUp,
              title: 'Score-Based Collateral',
              description: 'Higher Ethos scores mean lower collateral requirements. Build your reputation.',
            },
            {
              icon: Users,
              title: 'Full Utility Access',
              description: 'Borrowers get complete NFT utility via wrapper tokens. Use in games, metaverses, and more.',
            },
            {
              icon: Zap,
              title: 'Instant Rewards',
              description: 'Both parties earn +50 Ethos score on successful loans. Defaults get slashed.',
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i }}
              className="card-glow group p-5 sm:p-6"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon size={24} className="text-gold" />
              </div>
              <h3 className="font-semibold text-base sm:text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-dark-muted leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-3xl mx-auto">
        <ProtocolFlow />
      </section>

      {/* CTA */}
      <section className="text-center space-y-6 py-12">
        <h2 className="text-3xl font-display font-bold">
          Ready to <span className="text-gradient">Get Started?</span>
        </h2>
        <p className="text-dark-muted max-w-xl mx-auto">
          Join hundreds of lenders and borrowers leveraging reputation for secure NFT lending.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/marketplace" className="btn-primary">
            Explore Marketplace
          </Link>
          <Link href="/profile" className="btn-secondary">
            View Your Profile
          </Link>
        </div>
      </section>
    </div>
  );
}
