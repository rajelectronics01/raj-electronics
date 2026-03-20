import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

/**
 * RAJ ELECTRONICS: GLOBAL SECURITY GATEKEEPER
 * Verifies both Admin (admin-token) and Customer (user-token) sessions.
 * Matches: /admin, /api/admin, /api/user/me, /api/checkout/orders
 */

const getJwtSecretKey = () => new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. ADMIN PROTECTION
  const isAdminRoute = pathname.startsWith('/admin') && pathname !== '/admin/login';
  const isAdminApi = pathname.startsWith('/api/admin');
  const isScraperApi = pathname.startsWith('/api/scrape-product');

  if (isAdminRoute || isAdminApi || isScraperApi) {
    const token = request.cookies.get('admin-token')?.value;
    if (!token) return handleUnauthorized(request, '/admin/login');

    try {
      await jwtVerify(token, getJwtSecretKey());
      return NextResponse.next();
    } catch (e) {
      return handleUnauthorized(request, '/admin/login');
    }
  }

  // 2. CUSTOMER PROTECTION (Private Data)
  const isPrivateUserData = pathname.startsWith('/api/user/me') || 
                            pathname.startsWith('/api/user/update-name') ||
                            pathname.startsWith('/api/order/get'); // Potential future route

  if (isPrivateUserData) {
    const userToken = request.cookies.get('user-token')?.value;
    if (!userToken) return handleUnauthorized(request, '/login');

    try {
      await jwtVerify(userToken, getJwtSecretKey());
      return NextResponse.next();
    } catch (e) {
      return handleUnauthorized(request, '/login');
    }
  }

  return NextResponse.next();
}

/**
 * HELPER: Redirect or Deny
 */
function handleUnauthorized(request: NextRequest, redirectPath: string) {
  const { pathname } = request.nextUrl;
  
  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 });
  }
  
  const redirectUrl = new URL(redirectPath, request.url);
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: [
    '/admin/:path*', 
    '/api/admin/:path*', 
    '/api/user/:path*', 
    '/api/scrape-product/:path*'
  ],
};
