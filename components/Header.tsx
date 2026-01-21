'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAccount } from 'wagmi';
import { NotificationDropdown } from './NotificationDropdown';
import { WalletDropdown } from './WalletDropdown';
import { useEthos } from '@/hooks/useEthos';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/marketplace', label: 'Marketplace' },
  { href: '/lend', label: 'Lend' },
  { href: '/borrow', label: 'Borrow' },
  { href: '/profile', label: 'Profile' },
];

export function Header() {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showWalletDropdown, setShowWalletDropdown] = useState(false);
  const { address, isConnected } = useAccount();
  const { ethosProfile } = useEthos();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-dark-border bg-dark-bg/95 backdrop-blur supports-[backdrop-filter]:bg-dark-bg/80">
      <div className="container mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-2">
          {/* Logo - Left */}
          <Link href="/" className="flex items-center space-x-1.5 sm:space-x-2 group flex-shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-gold blur-md opacity-50 group-hover:opacity-75 transition-opacity animate-pulse"></div>
              <div className="relative w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-gold to-gold-dark rounded-lg flex items-center justify-center">
                <span className="text-dark-bg font-bold text-base sm:text-lg">E</span>
              </div>
            </div>
            <span className="font-display font-bold text-lg sm:text-xl text-gradient hidden xs:inline">
              EthosVault
            </span>
          </Link>

          {/* Navigation - Center (Desktop & Tablet) */}
          <nav className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center space-x-0.5 lg:space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-2.5 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-medium transition-all duration-200 whitespace-nowrap",
                  pathname === link.href
                    ? "bg-gold/10 text-gold"
                    : "text-dark-text hover:text-gold hover:bg-dark-card"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Wallet & Notifications - Right */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-dark-muted hover:text-gold transition-colors rounded-lg hover:bg-dark-card"
              >
                <Bell size={18} className="sm:w-5 sm:h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-ethos-exemplary rounded-full animate-pulse"></span>
              </button>
              
              {showNotifications && (
                <NotificationDropdown onClose={() => setShowNotifications(false)} />
              )}
            </div>
            
            {/* Wallet Button */}
            <div className="relative">
              <button
                onClick={() => setShowWalletDropdown(!showWalletDropdown)}
                className="btn-primary flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm px-3 sm:px-6 py-2 sm:py-3"
              >
                <Wallet size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="hidden sm:inline">
                  {isConnected && address
                    ? `${address.slice(0, 6)}...${address.slice(-4)}`
                    : 'Connect'}
                </span>
                <span className="inline sm:hidden">
                  {isConnected ? 'Wallet' : 'Connect'}
                </span>
                {isConnected && ethosProfile && (
                  <span className="px-1.5 sm:px-2 py-0.5 bg-dark-bg/50 rounded text-xs">
                    {ethosProfile.score}
                  </span>
                )}
              </button>

              {showWalletDropdown && (
                <WalletDropdown onClose={() => setShowWalletDropdown(false)} />
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex items-center justify-between pb-2 gap-1 overflow-x-auto scrollbar-hide">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-2 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap",
                pathname === link.href
                  ? "bg-gold/10 text-gold"
                  : "text-dark-text hover:text-gold"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}