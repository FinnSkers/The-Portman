import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Security headers configuration
const securityHeaders = {
  // Prevent XSS attacks
  'X-XSS-Protection': '1; mode=block',
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',
  // Enforce HTTPS
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  // Control referrer information
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  // Content Security Policy
  'Content-Security-Policy': `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' *.vercel-scripts.com;
    style-src 'self' 'unsafe-inline' fonts.googleapis.com;
    font-src 'self' fonts.gstatic.com;
    img-src 'self' data: https: *.githubusercontent.com *.gravatar.com;
    connect-src 'self' *.portman.ai wss: ws:;
    frame-ancestors 'none';
    base-uri 'self';
    form-action 'self';
  `.replace(/\s+/g, ' ').trim(),
  // Permissions Policy
  'Permissions-Policy': 'camera=(), microphone=(), location=(), payment=()'
};

// Rate limiting configuration
const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // Limit each IP to 100 requests per windowMs
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
};

// Simple in-memory rate limiter (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function getRateLimitKey(request: NextRequest): string {
  // Use IP address for rate limiting
  return request.ip || request.headers.get('x-forwarded-for') || 'unknown';
}

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const windowStart = now - rateLimitConfig.windowMs;
  
  // Clean up old entries
  for (const [k, v] of rateLimitStore.entries()) {
    if (v.resetTime < now) {
      rateLimitStore.delete(k);
    }
  }
  
  const current = rateLimitStore.get(key);
  
  if (!current || current.resetTime < now) {
    // New window or expired entry
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + rateLimitConfig.windowMs
    });
    return true;
  }
  
  if (current.count >= rateLimitConfig.maxRequests) {
    return false; // Rate limit exceeded
  }
  
  current.count++;
  return true;
}

// CSRF token validation
function generateCSRFToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function validateCSRFToken(request: NextRequest, token: string): boolean {
  const headerToken = request.headers.get('x-csrf-token');
  const cookieToken = request.cookies.get('csrf-token')?.value;
  
  return (headerToken === token || cookieToken === token) && token.length === 64;
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Apply security headers to all responses
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // Rate limiting
  const rateLimitKey = getRateLimitKey(request);
  if (!checkRateLimit(rateLimitKey)) {
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': '900', // 15 minutes
        ...Object.fromEntries(Object.entries(securityHeaders))
      }
    });
  }
  
  // Skip security checks for public routes and static assets
  const isPublicRoute = [
    '/',
    '/auth/signin',
    '/auth/signup',
    '/auth/error',
    '/api/auth',
    '/_next',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml'
  ].some(path => request.nextUrl.pathname.startsWith(path));
  
  const isStaticAsset = request.nextUrl.pathname.startsWith('/_next/static') ||
                       request.nextUrl.pathname.includes('.');
  
  if (isPublicRoute || isStaticAsset) {
    return response;
  }
  
  // Authentication check for protected routes
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  
  const isAuthRequired = [
    '/dashboard',
    '/portfolio',
    '/analytics',
    '/profile',
    '/api/profile',
    '/api/upload',
    '/api/portfolio'
  ].some(path => request.nextUrl.pathname.startsWith(path));
  
  if (isAuthRequired && !token) {
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(signInUrl);
  }
  
  // CSRF protection for state-changing requests
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
    const contentType = request.headers.get('content-type');
    
    // Skip CSRF for JSON API requests with proper authentication
    if (contentType?.includes('application/json') && token) {
      // Additional API security checks can be added here
      return response;
    }
    
    // Generate and set CSRF token for forms
    const csrfToken = generateCSRFToken();
    response.cookies.set('csrf-token', csrfToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 24 hours
    });
    
    // Validate CSRF token for form submissions
    if (!request.nextUrl.pathname.startsWith('/api/auth')) {
      const isValidCSRF = validateCSRFToken(request, csrfToken);
      if (!isValidCSRF) {
        return new NextResponse('Invalid CSRF Token', {
          status: 403,
          headers: Object.fromEntries(Object.entries(securityHeaders))
        });
      }
    }
  }
  
  // Add security context to response
  response.headers.set('x-request-id', crypto.randomUUID());
  response.headers.set('x-timestamp', new Date().toISOString());
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
