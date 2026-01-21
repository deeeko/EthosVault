'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error but don't crash the app for chrome extension errors
    if (error.message.includes('chrome.runtime.sendMessage')) {
      console.warn('Chrome extension error (safe to ignore):', error);
    } else {
      console.error('Application error:', error);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card p-8 text-center max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gold">Something went wrong</h2>
        <p className="text-dark-muted mb-6">
          An error occurred. Please try refreshing the page.
        </p>
        <button
          onClick={reset}
          className="btn-primary"
        >
          Try again
        </button>
      </div>
    </div>
  );
}