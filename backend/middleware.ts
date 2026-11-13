import { NextResponse } from 'next/server';

export function middleware() {
  const response = NextResponse.next();
  // CORS: allow frontend origin in development and from the deployed frontend
  const allowedOrigin = process.env.FRONTEND_URL ?? 'http://localhost:3000';
  response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
  response.headers.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, X-Client-Language, X-Session-ID');
  return response;
}

export const config = {
  matcher: '/api/:path*',
};
