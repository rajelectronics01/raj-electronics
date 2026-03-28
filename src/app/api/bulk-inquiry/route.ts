import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, organizationType, description } = body;

    // 1. Save to Database
    const inquiry = await (prisma as any).bulkInquiry.create({
      data: {
        name,
        phone,
        organizationType,
        description,
      },
    });

    // 2. Prepare Internal Notification (Simple log for now, or we can use a service)
    console.log(`🚀 NEW BULK INQUIRY: ${name} (${organizationType}) - ${phone}`);

    return NextResponse.json({ success: true, inquiryId: inquiry.id });
  } catch (error) {
    console.error('ERROR SAVING BULK INQUIRY:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
