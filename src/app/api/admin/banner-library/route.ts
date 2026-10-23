import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { BannerDesign } from '@/lib/banner-templates';

/**
 * RAJ ELECTRONICS: BANNER LIBRARY
 *
 * The shelf every banner made in the studio is kept on.
 *
 * A banner and a slide are deliberately two different things here. The `hero`
 * row holds what is on the homepage right now; this row holds every banner the
 * shop has ever designed, and nothing in it ever expires. So last Diwali's
 * banner is still here next Diwali — change the dates and the percentage and
 * put it back up, rather than designing it again from nothing.
 *
 * Read-modify-write happens on this side rather than in the browser: two admin
 * tabs open at once would otherwise each save the shelf they loaded on page
 * open, and the second save would drop whatever the first one added.
 *
 * Admin-only: /api/admin/* sits behind the admin token in middleware.ts.
 */

const KEY = 'banner-library';

/** Oldest-edited last, so the shelf reads newest-first in the studio. */
function sorted(banners: BannerDesign[]): BannerDesign[] {
    return [...banners].sort((a, b) =>
        (b.updatedAt ?? b.createdAt ?? '').localeCompare(a.updatedAt ?? a.createdAt ?? '')
    );
}

async function readLibrary(): Promise<BannerDesign[]> {
    const row = await (prisma as any).storeSetting.findUnique({ where: { key: KEY } });
    const value = row?.value;
    return Array.isArray(value) ? (value as BannerDesign[]) : [];
}

async function writeLibrary(banners: BannerDesign[]): Promise<BannerDesign[]> {
    const value = sorted(banners);
    await (prisma as any).storeSetting.upsert({
        where: { key: KEY },
        update: { value },
        create: { key: KEY, value },
    });
    return value;
}

export const revalidate = 0;

export async function GET() {
    try {
        return NextResponse.json({ banners: sorted(await readLibrary()) });
    } catch (error) {
        console.error('Banner library read failed:', error);
        return NextResponse.json({ error: 'Could not load your saved banners.' }, { status: 500 });
    }
}

/** Save a design, or overwrite the one already on the shelf under its id. */
export async function POST(req: Request) {
    let design: BannerDesign;

    try {
        const body = await req.json();
        design = body?.design;
    } catch {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    if (!design?.id || typeof design.headline !== 'string') {
        return NextResponse.json({ error: 'That is not a finished banner.' }, { status: 400 });
    }

    try {
        const banners = await readLibrary();
        const now = new Date().toISOString();
        const existing = banners.find((b) => b.id === design.id);

        const saved: BannerDesign = {
            ...design,
            // First save sets the date; later ones keep it, so the shelf can
            // still show how old a design is after it has been edited.
            createdAt: existing?.createdAt ?? design.createdAt ?? now,
            updatedAt: now,
        };

        const next = existing
            ? banners.map((b) => (b.id === saved.id ? saved : b))
            : [...banners, saved];

        return NextResponse.json({ banners: await writeLibrary(next), design: saved });
    } catch (error) {
        console.error('Banner library save failed:', error);
        return NextResponse.json({ error: 'Could not save that banner.' }, { status: 500 });
    }
}

/**
 * Take a banner off the shelf.
 *
 * This does not touch the homepage: a banner can be live and still be deleted
 * here, and the slide stays up until it is removed in the Hero tab. Keeping the
 * two separate is the point — tidying the shelf should never pull a live banner
 * off the shop's own front page by surprise.
 */
export async function DELETE(req: Request) {
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Which banner?' }, { status: 400 });

    try {
        const banners = await readLibrary();
        return NextResponse.json({ banners: await writeLibrary(banners.filter((b) => b.id !== id)) });
    } catch (error) {
        console.error('Banner library delete failed:', error);
        return NextResponse.json({ error: 'Could not remove that banner.' }, { status: 500 });
    }
}
