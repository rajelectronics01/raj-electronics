import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();
    if (!phone) return NextResponse.json({ success: false, message: 'Phone is required' }, { status: 400 });

    // TODO: Implement actual MSG91 or Twilio call here.
    // Example Twilio usage:
    // const twilio = require('twilio');
    // const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);
    // await client.messages.create({ body: 'Your OTP is 1234', from: process.env.TWILIO_PHONE, to: '+91' + phone });

    console.log(`[Twilio/MSG91 Mock] Sending OTP to +91 ${phone}`);

    return NextResponse.json({ success: true, message: 'OTP sent' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to send OTP' }, { status: 500 });
  }
}
