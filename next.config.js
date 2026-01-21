/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Externalize packages that cause issues
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    
    // Add fallbacks for ALL optional wallet connector dependencies
    config.resolve.fallback = {
      ...config.resolve.fallback,
      // Core externals
      'pino-pretty': false,
      'lokijs': false,
      'encoding': false,
      'fs': false,
      'net': false,
      'tls': false,
      'crypto': false,
      
      // Optional wallet connector dependencies
      '@metamask/sdk': false,
      '@coinbase/wallet-sdk': false,
      '@safe-global/safe-apps-provider': false,
      '@safe-global/safe-apps-sdk': false,
      '@walletconnect/ethereum-provider': false,
      '@walletconnect/modal': false,
      'expo-application': false,
      'expo-linking': false,
      '@ledgerhq/connect-kit-loader': false,
      '@gemini-wallet/core': false,
      '@base-org/account': false,
      'porto/internal': false,
      'porto': false,
    };
    
    // Also add as aliases to be extra sure
    config.resolve.alias = {
      ...config.resolve.alias,
      '@metamask/sdk': false,
      '@coinbase/wallet-sdk': false,
      '@safe-global/safe-apps-provider': false,
      '@safe-global/safe-apps-sdk': false,
      '@gemini-wallet/core': false,
      '@base-org/account': false,
      'porto/internal': false,
      'porto': false,
    };
    
    // Suppress warnings
    config.ignoreWarnings = [
      { module: /node_modules\/@walletconnect/ },
      { module: /node_modules\/wagmi/ },
      { module: /node_modules\/@wagmi/ },
    ];
    
    return config;
  },
};

module.exports = nextConfig;