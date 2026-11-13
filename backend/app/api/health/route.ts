import { NextResponse } from 'next/server';
import type { HealthResponse } from '@reportsaathi/shared';
import { getAppConfig } from '@/lib/db';

export const dynamic = 'force-dynamic'; // never cache

export async function GET(): Promise<NextResponse<HealthResponse>> {
  const config = getAppConfig();

  const payload: HealthResponse = {
    status: 'healthy',
    version: config.version,
    aiProvider: 'gemini-1.5-flash',
    timestamp: new Date().toISOString(),
    db: {
      connected: true,
      appName: config.app_name,
      seededAt: config.seeded_at,
    },
  };

  return NextResponse.json(payload, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}

// Pre-flight CORS handler
export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, { status: 204 });
}
