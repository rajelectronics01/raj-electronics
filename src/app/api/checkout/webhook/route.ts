import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyCallback } from '@/lib/phonepe';
import { notifyNewOrder } from '@/lib/notifications'; 

export async function POST(req: Request) {
  try {
    const xVerify = req.headers.get('X-VERIFY');
    const body = await req.json();
    const base64Response = body.response;

    if (!xVerify || !base64Response) {
      console.error('Webhook: Missing Signature or Payload');
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // 1. VERIFY SIGNATURE (Security First!)
    const isValid = verifyCallback(xVerify, base64Response);
    if (!isValid) {
      console.error('Webhook: Signature Mismatch - Security Alert!');
      return NextResponse.json({ success: false, error: 'Invalid Signature' }, { status: 401 });
    }

    // 2. Decode the Payload (Already in Base64)
    const decoded = JSON.parse(Buffer.from(base64Response, 'base64').toString());
    const { code, data } = decoded;

    if (code === 'PAYMENT_SUCCESS') {
      const transactionId = data.merchantTransactionId;
      const providerRefId = data.transactionId; // PhonePe internal ID

      // 3. Mark Order as PAID (Single Source of Truth)
      const order = await prisma.order.update({
        where: { transactionId },
        data: {
          paymentStatus: 'PAID',
          orderStatus: 'CONFIRMED',
          transactionId: providerRefId // Update with real reference
        },
        include: {
          user: true,
          address: true,
          items: { include: { product: true } }
        }
      });

      // 4. TRIGGER NOTIFICATIONS (Email + WhatsApp)
      // Note: We trigger this in the background / try-catch
      try {
        // notifyNewOrder should hold the Resend + Twilio WhatsApp logic
        await notifyNewOrder(order);
      } catch (err) {
        console.error('Webhook Notification Trigger Error:', err);
      }

      console.log(`Order ${order.id} verified and PAID.`);
      return NextResponse.json({ success: true });

    } else {
      console.log(`Payment failed for transaction: ${data.merchantTransactionId}`);
      // Mark as FAILED to prevent confusion
      await prisma.order.updateMany({
        where: { transactionId: data.merchantTransactionId },
        data: { paymentStatus: 'FAILED', orderStatus: 'CANCELLED' }
      });
      return NextResponse.json({ success: false, message: 'Payment Failed' });
    }

  } catch (error: any) {
    console.error('Webhook Error:', error.message);
    return NextResponse.json({ success: false, error: 'Internal Error' }, { status: 500 });
  }
}
