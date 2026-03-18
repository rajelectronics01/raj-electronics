import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { findOrCreateUser, createOrGetAddress } from '@/lib/orders';
import { notifyNewOrder } from '@/lib/notifications';

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

    // 1. Unified User/Address Logic
    const user = await findOrCreateUser(phone, address.name);
    const orderAddress = await createOrGetAddress(user.id, address);

    const totalAmount = product.price * qty;

    // 2. Create Order
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        addressId: orderAddress.id,
        totalAmount,
        paymentMethod: payMethod,
        paymentStatus: payMethod === 'COD' ? 'PENDING' : 'PAID',
        orderStatus: 'CONFIRMED', 
        items: {
          create: [{
            productId: product.id,
            quantity: qty,
            price: product.price
          }]
        }
      },
      include: {
        address: true,
        items: true,
        user: true
      }
    });

    // 3. Real-time Notifications (WhatsApp/SMS)
    try {
      await notifyNewOrder(order);
    } catch (err) {
      console.error('Notification Error:', err);
      // Don't fail the order if notification fails
    }

    return NextResponse.json({ 
      success: true, 
      orderId: order.id, 
      invoiceNo: order.invoiceNo 
    });

  } catch (error: any) {
    console.error('Create Order Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
