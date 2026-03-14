// API Route: POST /api/user/send-otp
// Generates a 6-digit OTP, stores it with expiry, and sends via Twilio SMS

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();

    if (!phone || !/^\d{10}$/.test(phone)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid 10-digit phone number." },
        { status: 400 }
      );
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Store OTP in DB (upsert so repeated sends overwrite the old one)
    await prisma.otpVerification.upsert({
      where: { phone },
      update: { otp, expiresAt, attempts: 0 },
      create: { phone, otp, expiresAt, attempts: 0 },
    });

    // ── PRODUCTION: Uncomment when Twilio credentials are added to .env ──
    // const twilio = require("twilio");
    // const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    // await client.messages.create({
    //   body: `Your Raj Electronics OTP is: ${otp}. Valid for 5 minutes. Do not share this with anyone.`,
    //   from: process.env.TWILIO_PHONE_NUMBER,  // e.g. '+12015551234'
    //   to: `+91${phone}`,
    // });

    // ── DEV ONLY: Log OTP to console ──
    if (process.env.NODE_ENV !== "production") {
      console.log(`[DEV OTP] Phone: +91${phone} → OTP: ${otp}`);
    }

    return NextResponse.json({ success: true, message: "OTP sent successfully." });
  } catch (error: any) {
    console.error("send-otp error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send OTP. Please try again." },
      { status: 500 }
    );
  }
}
