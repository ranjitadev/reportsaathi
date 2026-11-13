'use client';

import type { HealthResponse } from '@reportsaathi/shared';

interface Props {
  health: HealthResponse | null;
}

/**
 * HealthStatus — Client Component
 *
 * Renders the data the backend read from its SQLite database:
 *   - app name seeded in DB
 *   - version seeded in DB
 *   - timestamp when DB row was written
 */
export default function HealthStatus({ health }: Props): React.JSX.Element {
  if (!health) {
    return (
      <div
        data-testid="health-error"
        className="bg-red-50 border border-red-300 rounded-xl p-6 max-w-md w-full text-center"
        role="alert"
      >
        <span className="text-red-600 text-lg font-semibold">⚠ Backend Unreachable</span>
        <p className="text-red-500 mt-2 text-sm">
          Could not reach the backend API. Check that the backend is running and{' '}
          <code className="bg-red-100 px-1 rounded">NEXT_PUBLIC_BACKEND_URL</code> is set.
        </p>
      </div>
    );
  }

  const statusColor = health.status === 'healthy' ? 'text-green' : 'text-amber';
  const statusBg = health.status === 'healthy' ? 'bg-green-50 border-green-300' : 'bg-amber-50 border-amber-300';

  return (
    <div
      data-testid="health-card"
      className={`border rounded-xl p-6 max-w-md w-full ${statusBg}`}
    >
      <div className="flex items-center gap-3 mb-4">
        <span className={`text-2xl font-bold ${statusColor}`}>
          {health.status === 'healthy' ? '✓' : '⚠'} {health.status.toUpperCase()}
        </span>
      </div>

      <table className="w-full text-sm">
        <tbody>
          <tr className="border-b border-gray-200">
            <td className="py-2 font-medium text-gray-600">Version</td>
            <td className="py-2 text-right font-mono" data-testid="health-version">
              {health.version}
            </td>
          </tr>
          <tr className="border-b border-gray-200">
            <td className="py-2 font-medium text-gray-600">AI Provider</td>
            <td className="py-2 text-right font-mono">{health.aiProvider}</td>
          </tr>
          <tr className="border-b border-gray-200">
            <td className="py-2 font-medium text-gray-600">Response Time</td>
            <td className="py-2 text-right font-mono text-xs">
              {new Date(health.timestamp).toLocaleTimeString()}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Values the backend read from its SQLite database */}
      <div className="mt-4 bg-white rounded-lg p-4 border border-gray-100">
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-2 font-semibold">
          From Database (SQLite)
        </p>
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="py-2 font-medium text-gray-600">App Name</td>
              <td className="py-2 text-right font-mono" data-testid="db-app-name">
                {health.db.appName}
              </td>
            </tr>
            <tr>
              <td className="py-2 font-medium text-gray-600">DB Seeded At</td>
              <td className="py-2 text-right font-mono text-xs" data-testid="db-seeded-at">
                {new Date(health.db.seededAt).toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
