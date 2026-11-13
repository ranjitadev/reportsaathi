 import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Backend-only: disable default pages
  // All UI lives in frontend/, this app only serves /api/* routes
  typedRoutes: true,
};

export default nextConfig;