import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * RAJ ELECTRONICS: SUPABASE KEEP-ALIVE
 *
 * Supabase's free tier pauses a project after 7 days with no database activity —
 * which is exactly what took the store offline. Vercel Cron hits this route daily
 * (see vercel.json) to run one trivial query and reset that clock.
 *
 * Vercel attaches `Authorization: Bearer $CRON_SECRET` when CRON_SECRET is set,
 * which is what keeps this route from being a free DB-query endpoint for anyone.
 */

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const secret = process.env.CRON_SECRET;

    if (secret && request.headers.get('authorization') !== `Bearer ${secret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Cheapest possible write-free touch that still counts as activity.
        const products = await prisma.product.count();

        return NextResponse.json({
            ok: true,
            products,
            checkedAt: new Date().toISOString(),
        });
    } catch (error: any) {
        // A failure here is the early warning that the project is paused again.
        console.error('[keep-alive] Database unreachable:', error?.message);
        return NextResponse.json(
            { ok: false, error: 'Database unreachable' },
            { status: 503 }
        );
    }
}
