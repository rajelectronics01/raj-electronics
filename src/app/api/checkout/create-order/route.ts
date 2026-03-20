import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { findOrCreateUser, createOrGetAddress } from '@/lib/orders';
import { PHONEPE_CONFIG, generateXVerify } from '@/lib/phonepe';
import axios from 'axios';

export async function POST(req: Request) {
  try {
    const { productId, phone, address, qty, payMethod } = await req.json();

    if (!productId || !phone || !address || !qty) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) { 
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 }); 
    }

    const user = await findOrCreateUser(phone, address.name, address.email);
    const orderAddress = await createOrGetAddress(user.id, address);
    const totalAmount = product.price * qty;

    // 1. Unique Transaction ID for PhonePe (Format: RAJ-USER-TIMESTAMP)
    const transactionId = `RAJ-${user.id.slice(-4)}-${Date.now()}`;

    // 2. Create Order in DB (Always PENDING for Online)
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        addressId: orderAddress.id,
        totalAmount,
        paymentMethod: payMethod,
        paymentStatus: 'PENDING',
        orderStatus: payMethod === 'COD' ? 'CONFIRMED' : 'PENDING',
        transactionId: transactionId,
        items: {
          create: [{
            productId: product.id,
            quantity: qty,
            price: product.price
          }]
        }
      }
    });

    if (payMethod === 'COD') {
      try {
        const { getOrderWithDetails } = await import('@/lib/orders');
        const { notifyNewOrder } = await import('@/lib/notifications');
        const fullOrder = await getOrderWithDetails(order.id);
        if (fullOrder) await notifyNewOrder(fullOrder);
      } catch (e) {
        console.error('Notification Error:', e);
      }
      return NextResponse.json({ success: true, orderId: order.id, redirect: `/order/${order.id}` });
    }

    // 3. Official PhonePe Payload (V1/PG/PAY)
    const payload = {
      merchantId: PHONEPE_CONFIG.MERCHANT_ID,
      merchantTransactionId: transactionId,
      merchantUserId: user.id,
      amount: totalAmount * 100, // PhonePe works in Paise
      redirectUrl: `${PHONEPE_CONFIG.REDIRECT_URL}/${order.id}`,
      redirectMode: 'POST',
      callbackUrl: PHONEPE_CONFIG.CALLBACK_URL,
      mobileNumber: phone,
      paymentInstrument: { type: 'PAY_PAGE' }
    };

    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    const xVerify = generateXVerify(base64Payload, '/pg/v1/pay');

    // 4. Call PhonePe API
    const response = await axios.post(
      `${PHONEPE_CONFIG.HOST}/pg/v1/pay`, 
      { request: base64Payload }, 
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': xVerify,
          'accept': 'application/json'
        }
      }
    );

    if (response.data?.success && response.data?.data?.instrumentResponse?.redirectInfo?.url) {
      return NextResponse.json({ 
        success: true, 
        paymentUrl: response.data.data.instrumentResponse.redirectInfo.url 
      });
    } else {
      throw new Error(response.data?.message || 'PhonePe connection failed');
    }

  } catch (error: any) {
    const errorMsg = error?.response?.data?.message || error?.message || 'Unknown error';
    console.error('Create Order Error:', errorMsg);
    return NextResponse.json({ success: false, error: `Order Error: ${errorMsg}` }, { status: 500 });
  }
}
