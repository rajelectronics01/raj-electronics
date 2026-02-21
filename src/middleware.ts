import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Secret key for JWT verification
const getJwtSecretKey = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length === 0) {
        throw new Error('The environment variable JWT_SECRET is not set.');
    }
    return secret;
};

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // We want to protect all /admin routes EXCEPT the login page
    const isAdminRoute = pathname.startsWith('/admin') && pathname !== '/admin/login';

    // We want to protect mutation APIs from public access
    const isProtectedApi = pathname.startsWith('/api/products') && ['POST', 'PUT', 'DELETE'].includes(request.method);
    const isScraperApi = pathname.startsWith('/api/scrape-product');

    if (isAdminRoute || isProtectedApi || isScraperApi) {
        const token = request.cookies.get('admin-token')?.value;

        if (!token) {
            return redirectToLogin(request);
        }

        try {
            // Verify the JWT token using 'jose' (Edge compatible)
            const secret = new TextEncoder().encode(getJwtSecretKey());
            await jwtVerify(token, secret);

            // Authentication successful, user can proceed
            return NextResponse.next();
        } catch (error) {
            // Token is invalid or expired
            return redirectToLogin(request);
        }
    }

    return NextResponse.next();
}

function redirectToLogin(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // For API requests, return a generic 401 Unauthorized instead of HTML redirect
    if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 });
    }

    // For browser pages, redirect securely to the login portal
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
}

// Config specifies which routes this middleware strictly runs on matches
export const config = {
    matcher: ['/admin/:path*', '/api/products/:path*', '/api/scrape-product/:path*'],
};
