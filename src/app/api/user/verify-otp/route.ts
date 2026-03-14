// API Route: POST /api/user/verify-otp
// Verifies the OTP, creates or finds the User, and sets a user-token JWT cookie

import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

const MAX_ATTEMPTS = 5;
const getSecret = () => new TextEncoder().encode(process.env.JWT_SECRET!);

export async function POST(req: Request) {
  try {
    const { phone, otp, name } = await req.json();

    if (!phone || !otp) {
      return NextResponse.json(
        { success: false, message: "Phone and OTP are required." },
        { status: 400 }
      );
    }

    // Find the stored OTP record
    const record = await prisma.otpVerification.findUnique({ where: { phone } });

    if (!record) {
      return NextResponse.json(
        { success: false, message: "OTP not found. Please request a new one." },
        { status: 400 }
      );
    }

    // Check if OTP has expired
    if (new Date() > record.expiresAt) {
      await prisma.otpVerification.delete({ where: { phone } });
      return NextResponse.json(
        { success: false, message: "OTP has expired. Please request a new one.", expired: true },
        { status: 400 }
      );
    }

    // Check attempt limit
    if (record.attempts >= MAX_ATTEMPTS) {
      return NextResponse.json(
        { success: false, message: "Too many incorrect attempts. Please request a new OTP." },
        { status: 429 }
      );
    }

    // Verify OTP
    if (record.otp !== otp) {
      // Increment attempt counter
      await prisma.otpVerification.update({
        where: { phone },
        data: { attempts: { increment: 1 } },
      });
      const remaining = MAX_ATTEMPTS - record.attempts - 1;
      return NextResponse.json(
        { success: false, message: `Incorrect OTP. ${remaining} attempt${remaining !== 1 ? "s" : ""} remaining.` },
        { status: 401 }
      );
    }

    // ── OTP is correct ──

    // Clean up the OTP record immediately
    await prisma.otpVerification.delete({ where: { phone } });

    // Find or create the User
    let user = await prisma.user.findUnique({ where: { phone } });
    const isNewUser = !user;

    if (!user) {
      user = await prisma.user.create({
        data: { phone, name: name?.trim() || null },
      });
    } else if (name?.trim() && !user.name) {
      // Update name if it was provided and not previously set
      user = await prisma.user.update({
        where: { phone },
        data: { name: name.trim() },
      });
    }

    // Sign a JWT for the customer session (7 day expiry)
    const token = await new SignJWT({ userId: user.id, role: "user" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(getSecret());

    // Set httpOnly cookie
    const cookieStore = await cookies();
    cookieStore.set("user-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return NextResponse.json({
      success: true,
      isNewUser,
      user: { id: user.id, phone: user.phone, name: user.name },
    });
  } catch (error: any) {
    console.error("verify-otp error:", error);
    return NextResponse.json(
      { success: false, message: "Verification failed. Please try again." },
      { status: 500 }
    );
  }
}
