// POST /api/user/firebase-auth
//
// Flow:
//   1. Firebase Phone Auth completes on the CLIENT (OTP sent/verified by Firebase)
//   2. Client gets a Firebase ID Token (signed JWT from Google)
//   3. Client POSTs that token here
//   4. We verify it against Firebase's public JWKS (no firebase-admin needed — uses jose)
//   5. Extract phone_number from token claims
//   6. Find or create User in Prisma
//   7. Issue our own user-token JWT in an httpOnly cookie

import { NextResponse } from 'next/server';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

// Firebase public keys for token verification (RS256)
const FIREBASE_JWKS = createRemoteJWKSet(
  new URL(
    'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'
  )
);

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!;
const getOurSecret = () => new TextEncoder().encode(process.env.JWT_SECRET!);

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();

    if (!idToken) {
      return NextResponse.json(
        { success: false, message: 'Firebase ID token is required.' },
        { status: 400 }
      );
    }

    // ── 1. Verify the Firebase ID Token ──────────────────────────────────────
    let payload: any;
    try {
      const result = await jwtVerify(idToken, FIREBASE_JWKS, {
        issuer:   `https://securetoken.google.com/${PROJECT_ID}`,
        audience: PROJECT_ID,
      });
      payload = result.payload;
    } catch (e: any) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired Firebase token.' },
        { status: 401 }
      );
    }

    // ── 2. Extract phone number ───────────────────────────────────────────────
    const rawPhone: string | undefined = payload.phone_number;
    if (!rawPhone) {
      return NextResponse.json(
        { success: false, message: 'No phone number in Firebase token.' },
        { status: 400 }
      );
    }

    // Firebase gives '+919876543210' → we store '9876543210'
    const phone = rawPhone.startsWith('+91')
      ? rawPhone.slice(3)
      : rawPhone.replace(/^\+/, '');

    // ── 3. Find or create the User in Prisma ─────────────────────────────────
    let user = await prisma.user.findUnique({ where: { phone } });
    const isNewUser = !user;

    if (!user) {
      user = await prisma.user.create({ data: { phone } });
    }

    // ── 4. Issue our own 7-day JWT cookie ─────────────────────────────────────
    const token = await new SignJWT({ userId: user.id, role: 'user' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(getOurSecret());

    const cookieStore = await cookies();
    cookieStore.set('user-token', token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge:   60 * 60 * 24 * 7,
      path:     '/',
    });

    return NextResponse.json({
      success: true,
      isNewUser,
      user: { id: user.id, phone: user.phone, name: user.name },
    });
  } catch (error: any) {
    console.error('firebase-auth error:', error);
    return NextResponse.json(
      { success: false, message: 'Authentication failed. Please try again.' },
      { status: 500 }
    );
  }
}
