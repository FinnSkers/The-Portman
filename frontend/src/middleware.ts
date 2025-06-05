import { NextResponse } from 'next/server';

export function middleware() {
  // Example: Add custom headers, handle redirects, etc.
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
