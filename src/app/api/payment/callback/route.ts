import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyCallback } from '@/lib/phonepe';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const xVerify = req.headers.get('x-verify') || '';
    
    // Body is base64 encoded by PhonePe
    const base64Body = body.response;
    
    if (!verifyCallback(xVerify, base64Body)) {
       return NextResponse.json({ success: false, message: 'Invalid Checksum' }, { status: 400 });
    }

    const decodedResponse = JSON.parse(Buffer.from(base64Body, 'base64').toString());
    const { success, code, data } = decodedResponse;
    const { merchantTransactionId } = data;

    if (success && code === 'PAYMENT_SUCCESS') {
      await prisma.order.update({
        where: { transactionId: merchantTransactionId },
        data: { 
          paymentStatus: 'PAID',
          orderStatus: 'CONFIRMED'
        }
      });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('PhonePe Callback Error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
