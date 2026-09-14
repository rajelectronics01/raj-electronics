import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

/**
 * RAJ ELECTRONICS: GLOBAL SECURITY GATEKEEPER
 * Verifies both Admin (admin-token) and Customer (user-token) sessions.
 */

const getJwtSecretKey = () => new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. ADMIN PROTECTION
  const isAdminRoute = pathname.startsWith('/admin') && pathname !== '/admin/login';
  const isAdminApi = pathname.startsWith('/api/admin');
  const isScraperApi = pathname.startsWith('/api/scrape-product');

  // 2. WRITE PROTECTION FOR PUBLIC-READ APIS
  // GET /api/products stays open — it returns the same catalogue the storefront
  // already renders. Creating, editing and deleting products must be admin-only,
  // and /api/upload has no legitimate public use at all.
  const isProductWrite =
    pathname.startsWith('/api/products') && request.method !== 'GET';
  const isUploadApi = pathname.startsWith('/api/upload');

  if (isAdminRoute || isAdminApi || isScraperApi || isProductWrite || isUploadApi) {
    return requireToken(request, 'admin-token', '/admin/login');
  }

  // 3. CUSTOMER PROTECTION (Private Data)
  const isPrivateUserData =
    pathname.startsWith('/api/user/me') ||
    pathname.startsWith('/api/user/update-name') ||
    pathname.startsWith('/api/order/get'); // Potential future route

  if (isPrivateUserData) {
    return requireToken(request, 'user-token', '/login');
  }

  return NextResponse.next();
}

/**
 * HELPER: Require a valid JWT in the named cookie, or bounce the request.
 */
async function requireToken(
  request: NextRequest,
  cookieName: string,
  redirectPath: string
) {
  const token = request.cookies.get(cookieName)?.value;
  if (!token) return handleUnauthorized(request, redirectPath);

  try {
    await jwtVerify(token, getJwtSecretKey());
    return NextResponse.next();
  } catch {
    return handleUnauthorized(request, redirectPath);
  }
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
    '/api/scrape-product/:path*',
    '/api/products/:path*',
    '/api/upload/:path*',
  ],
};
