import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { productId, phone, address, qty, payMethod } = await req.json();

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) { return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 }); }

    let user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      user = await prisma.user.create({ data: { phone, name: address.name } });
    }

    // Save Address
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

    const totalAmount = product.price * qty;

    // Create Order
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        addressId: newAddress.id,
        totalAmount,
        paymentMethod: payMethod,
        paymentStatus: payMethod === 'COD' ? 'PENDING' : 'PAID', // In real life, verify via razorpay webhook
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

    // --- REAL-TIME NOTIFICATIONS ---
    // In production, you would trigger a WhatsApp/SMS alert here
    // Example using Twilio or a similar webhook:
    /*
    await fetch('https://api.whatsapp-provider.com/send', {
      method: 'POST',
      body: JSON.stringify({
        to: '+919290748866', // Shop Owner
        message: `New Order! \nID: ${order.id}\nCustomer: ${address.name}\nProduct: ${product.name}\nAmount: ₹${totalAmount}`
      })
    });
    */

    return NextResponse.json({ success: true, order });

  } catch (error: any) {
    console.error('Create Order Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
