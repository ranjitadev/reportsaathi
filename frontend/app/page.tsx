import type { HealthResponse } from '@reportsaathi/shared';
import HealthStatus from '@/components/HealthStatus';

/**
 * Root page — Walking Skeleton
 *
 * Server Component: fetches /api/health from the backend at render time.
 * Shows the value the backend read from its in-memory SQLite database.
 */
async function fetchHealth(): Promise<HealthResponse | null> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:3001';
  try {
    const res = await fetch(`${backendUrl}/api/health`, {
      next: { revalidate: 10 }, // re-fetch every 10s in production
    });
    if (!res.ok) return null;
    return (await res.json()) as HealthResponse;
  } catch {
    return null;
  }
}

export default async function HomePage(): Promise<React.JSX.Element> {
  const health = await fetchHealth();

  return (
    <main className="min-h-screen bg-canvas flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-teal mb-2">
        ReportSaathi <span className="text-amber">| रिपोर्ट साथी</span>
      </h1>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        Walking skeleton — backend health check
      </p>

      <HealthStatus health={health} />

      <p className="mt-10 text-xs text-gray-400">
        Task 0.3 — Walking Skeleton &amp; Healthcheck
      </p>
    </main>
  );
}
