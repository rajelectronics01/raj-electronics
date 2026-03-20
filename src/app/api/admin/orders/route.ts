import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        address: true,
        items: {
          include: { product: true }
        }
      }
    });

    const formattedOrders = orders.map((o: any) => ({
      id: o.id,
      invoiceNo: o.invoiceNo,
      customer: o.address?.name || o.user.name || 'Customer',
      phone: o.user.phone,
      product: o.items[0]?.product.name || 'Unknown',
      amount: o.totalAmount,
      payment: o.paymentMethod,
      status: o.orderStatus,
      time: o.createdAt,
      addr: `${o.address?.street}, ${o.address?.area} (${o.address?.pin || ''})`
    }));

    return NextResponse.json({ success: true, orders: formattedOrders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { orderId, status } = await req.json();
    await prisma.order.update({
      where: { id: orderId },
      data: { orderStatus: status }
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
