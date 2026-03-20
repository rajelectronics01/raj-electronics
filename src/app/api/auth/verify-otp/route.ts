import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { findOrCreateUser } from '@/lib/orders';

const getOurSecret = () => new TextEncoder().encode(process.env.JWT_SECRET!);

export async function POST(req: Request) {
  try {
    const { idToken, name } = await req.json();

    if (!idToken) {
      return NextResponse.json({ success: false, message: 'ID Token is required' }, { status: 400 });
    }

    // 1. Verify the Firebase ID Token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const phoneWithCountry = decodedToken.phone_number; 
    
    if (!phoneWithCountry) {
      return NextResponse.json({ success: false, message: 'Phone number not found in token' }, { status: 400 });
    }

    // Convert +919876543210 to 9876543210 for Prisma consistency
    const phone = phoneWithCountry.replace('+91', '').slice(-10);

    // 2. Sync with Prisma (Using your existing findOrCreate logic)
    const user = await findOrCreateUser(phone, name);

    // 3. Issue our own secure 7-day session JWT
    const token = await new SignJWT({ userId: user.id, role: 'user' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(getOurSecret());

    const cookieStore = await cookies();
    cookieStore.set('user-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return NextResponse.json({
      success: true,
      user: { id: user.id, phone: user.phone, name: user.name }
    });
  } catch (error: any) {
    console.error('Firebase verification error:', error);
    return NextResponse.json({ success: false, message: 'Authentication failed' }, { status: 401 });
  }
}
