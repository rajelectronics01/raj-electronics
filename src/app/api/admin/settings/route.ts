import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const revalidate = 0;

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const key = searchParams.get('key');
        
        if (!key) {
            return NextResponse.json({ error: 'Key query parameter is required' }, { status: 400 });
        }

        const setting = await (prisma as any).storeSetting.findUnique({
            where: { key }
        });

        if (!setting) {
            return NextResponse.json({ data: null });
        }

        return NextResponse.json({ data: setting.value });
    } catch (error) {
        console.error("GET Setting Error:", error);
        return NextResponse.json({ error: 'Failed to fetch setting' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { key, value } = body;

        if (!key || value === undefined) {
            return NextResponse.json({ error: 'Key and value are required' }, { status: 400 });
        }

        const updated = await (prisma as any).storeSetting.upsert({
            where: { key },
            update: { value },
            create: { key, value }
        });

        return NextResponse.json({ data: updated.value });
    } catch (error) {
        console.error("POST Setting Error:", error);
        return NextResponse.json({ error: 'Failed to save setting' }, { status: 500 });
    }
}
