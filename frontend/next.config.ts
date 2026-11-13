 import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typedRoutes: true,
  // Expose the backend URL to client-side code without leaking secrets
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:3001',
  },
};

export default nextConfig;
