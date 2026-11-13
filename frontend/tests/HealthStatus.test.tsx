import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HealthStatus from '../components/HealthStatus';
import type { HealthResponse } from '@reportsaathi/shared';

const mockHealth: HealthResponse = {
  status: 'healthy',
  version: '1.0.0',
  aiProvider: 'gemini-1.5-flash',
  timestamp: '2026-11-13T09:00:00.000Z',
  db: {
    connected: true,
    appName: 'ReportSaathi',
    seededAt: '2026-11-13T09:00:00.000Z',
  },
};

describe('HealthStatus component', () => {
  it('renders the health card when health data is provided', () => {
    render(<HealthStatus health={mockHealth} />);
    expect(screen.getByTestId('health-card')).toBeInTheDocument();
  });

  it('shows the version from health response', () => {
    render(<HealthStatus health={mockHealth} />);
    expect(screen.getByTestId('health-version')).toHaveTextContent('1.0.0');
  });

  it('shows the app name read from database', () => {
    render(<HealthStatus health={mockHealth} />);
    expect(screen.getByTestId('db-app-name')).toHaveTextContent('ReportSaathi');
  });

  it('shows a seeded-at timestamp from the database', () => {
    render(<HealthStatus health={mockHealth} />);
    expect(screen.getByTestId('db-seeded-at')).toBeInTheDocument();
  });

  it('renders an error state when health is null', () => {
    render(<HealthStatus health={null} />);
    expect(screen.getByTestId('health-error')).toBeInTheDocument();
  });

  it('error state has role="alert"', () => {
    render(<HealthStatus health={null} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
