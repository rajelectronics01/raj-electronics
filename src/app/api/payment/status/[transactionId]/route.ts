import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateXVerify, PHONEPE_CONFIG } from '@/lib/phonepe';
import axios from 'axios';

export async function GET(req: Request, props: { params: Promise<{ transactionId: string }> }) {
  const params = await props.params;
  const transactionId = params.transactionId;

  try {
    const endpoint = `/pg/v1/status/${PHONEPE_CONFIG.MERCHANT_ID}/${transactionId}`;
    const checksum = generateXVerify('', endpoint); // empty body for GET status

    const response = await axios.get(`${PHONEPE_CONFIG.HOST}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
        'X-MERCHANT-ID': PHONEPE_CONFIG.MERCHANT_ID,
        'accept': 'application/json'
      }
    });

    const isSuccess = response.data.success && response.data.code === 'PAYMENT_SUCCESS';

    if (isSuccess) {
      // Update order status and fetch order ID for redirect
      const order = await prisma.order.update({
        where: { transactionId },
        data: { 
          paymentStatus: 'PAID',
          orderStatus: 'CONFIRMED'
        },
        include: {
          address: true,
          items: true,
          user: true
        }
      });

      // Trigger Notifications
      try {
        const { notifyNewOrder } = await import('@/lib/notifications');
        await notifyNewOrder(order);
      } catch (err) {
        console.error('Notification Error:', err);
      }

      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/order/${order.id}`);
    } else {
      await prisma.order.update({
        where: { transactionId },
        data: { paymentStatus: 'FAILED' }
      });
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/order/failed?t=${transactionId}`);
    }

  } catch (error) {
    console.error('Payment Status Error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/order/failed?t=${transactionId}`);
  }
}
