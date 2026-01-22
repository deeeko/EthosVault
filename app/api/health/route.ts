import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    backend: 'deployed',
    apis: {
      marketplace: '/api/marketplace/listings',
      collateral: '/api/borrow/calculate-collateral',
      activity: '/api/profile/activity',
      auth: '/api/auth/me',
    },
  });
}
