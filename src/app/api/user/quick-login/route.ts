import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

const getOurSecret = () => new TextEncoder().encode(process.env.JWT_SECRET!);

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();

    if (!phone || !/^\d{10}$/.test(phone)) {
      return NextResponse.json(
        { success: false, message: 'A valid 10-digit phone number is required.' },
        { status: 400 }
      );
    }

    // 1. Find or create the User in Prisma
    let user = await prisma.user.findUnique({ where: { phone } });
    const isNewUser = !user;

    if (!user) {
      user = await prisma.user.create({ data: { phone } });
    }

    // 2. Issue our own 7-day JWT cookie
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
    console.error('quick-login error:', error);
    return NextResponse.json(
      { success: false, message: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}
