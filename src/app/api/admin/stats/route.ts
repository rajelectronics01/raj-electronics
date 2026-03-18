import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const [orders, productsCount] = await Promise.all([
      prisma.order.findMany(),
      prisma.product.count()
    ]);

    const today = new Date().toISOString().split("T")[0];
    
    const stats = orders.reduce((acc, o) => {
        const orderDate = new Date(o.createdAt).toISOString().split("T")[0];
        const isToday = orderDate === today;
        
        acc.totalOrders += 1;
        acc.totalRevenue += o.totalAmount;
        
        if (isToday) {
            acc.todayOrders += 1;
            acc.todayRevenue += o.totalAmount;
        }
        
        if (o.orderStatus === 'PENDING') {
            acc.pendingOrders += 1;
        }
        
        return acc;
    }, {
        totalOrders: 0,
        pendingOrders: 0,
        totalRevenue: 0,
        todayOrders: 0,
        todayRevenue: 0,
        totalProducts: productsCount
    });

    return NextResponse.json({ success: true, stats });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
