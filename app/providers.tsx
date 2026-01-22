'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { config } from '@/lib/wagmi';
import { Header } from '@/components/Header';
import { Toaster } from 'sonner';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: '#D4AF37',
            accentColorForeground: '#0A0A0A',
            borderRadius: 'large',
          })}
        >
          <Toaster position="top-right" richColors />
          <Header />
          <main className="min-h-screen">{children}</main>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}