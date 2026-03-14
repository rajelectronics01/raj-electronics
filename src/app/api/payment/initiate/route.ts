import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateChecksum, PHONEPE_CONFIG } from '@/lib/phonepe';
import axios from 'axios';

export async function POST(req: Request) {
  try {
    const { productId, phone, address, qty, totalAmount } = await req.json();

    // 1. Create Order in Pending state
    const transactionId = `T${Date.now()}`;
    
    // We reuse existing logic to find/create user and address
    let user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      user = await prisma.user.create({ data: { phone, name: address.name } });
    }

    const newAddress = await prisma.address.create({
      data: {
        userId: user.id,
        name: address.name,
        phone: address.phone,
        street: address.street,
        area: address.area,
        pin: address.pin,
      }
    });

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        addressId: newAddress.id,
        totalAmount,
        paymentMethod: 'PHONEPE',
        paymentStatus: 'PENDING',
        orderStatus: 'PENDING',
        transactionId,
        items: {
          create: [{
            productId,
            quantity: qty,
            price: totalAmount / qty
          }]
        }
      }
    });

    // 2. Prepare PhonePe Payload
    const payload = {
      merchantId: PHONEPE_CONFIG.MERCHANT_ID,
      merchantTransactionId: transactionId,
      merchantUserId: user.id,
      amount: totalAmount * 100, // PhonePe takes amount in paise
      redirectUrl: `${PHONEPE_CONFIG.REDIRECT_URL}/${transactionId}`,
      redirectMode: 'REDIRECT',
      callbackUrl: PHONEPE_CONFIG.CALLBACK_URL,
      mobileNumber: phone,
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    };

    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    const endpoint = '/pg/v1/pay';
    const checksum = generateChecksum(base64Payload, endpoint);

    // 3. Call PhonePe to get Payment URL
    const response = await axios.post(
      `${PHONEPE_CONFIG.HOST}${endpoint}`,
      { request: base64Payload },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': checksum,
          'accept': 'application/json'
        }
      }
    );

    if (response.data.success) {
      const url = response.data.data.instrumentResponse.redirectInfo.url;
      return NextResponse.json({ success: true, url, orderId: order.id });
    } else {
      return NextResponse.json({ success: false, message: 'PhonePe initiation failed' }, { status: 500 });
    }

  } catch (error: any) {
    console.error('PhonePe Initiate Error:', error.response?.data || error.message);
    return NextResponse.json({ success: false, error: 'Payment initiation failed' }, { status: 500 });
  }
}
