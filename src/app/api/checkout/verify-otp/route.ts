import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { phone, otp } = await req.json();

    if (otp === '1234') {
      let user = await prisma.user.findUnique({ where: { phone } });
      if (!user) {
        user = await prisma.user.create({ data: { phone } });
      }
      return NextResponse.json({ success: true, userId: user.id });
    }

    return NextResponse.json({ success: false, message: 'Invalid OTP' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Verification failed' }, { status: 500 });
  }
}
