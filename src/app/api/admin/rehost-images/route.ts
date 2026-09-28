import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import sharp from 'sharp';
import prisma from '@/lib/prisma';
import { putImage, storageConfigured } from '@/lib/storage';

/**
 * RAJ ELECTRONICS: MOVE PRODUCT IMAGES ONTO OUR OWN STORAGE
 *
 * Scraped products point at images on Amazon, Flipkart, Croma etc. Those links
 * can break at any time, and Google Images credits the host, not us. This copies
 * them into Supabase Storage with SEO-friendly names (the product slug).
 *
 * Works in small batches so each call fits inside the serverless time limit;
 * the admin UI keeps calling until nothing is left. Admin-only via middleware.
 */

export const runtime = 'nodejs';
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const BATCH_SIZE = 6;          // products per call
const MAX_EDGE = 1600;

function isOurs(url: string) {
    if (!url.startsWith('http')) return true; // relative = already on our site
    const host = new URL(url).host;
    const storageHost = process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).host : '';
    return host === storageHost || host.endsWith('rajelectronics.co');
}

async function pending(skip: Set<string>) {
    const products = await prisma.product.findMany({ select: { id: true, slug: true, images: true } });
    return products.filter((p) => p.images.some((u) => !isOurs(u) && !skip.has(u)));
}

async function copyImage(url: string, name: string) {
    const res = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Accept': 'image/avif,image/webp,image/jpeg,image/png,image/*;q=0.8',
        },
        signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    // sharp rather than Jimp: Amazon and most brand sites serve WebP, which Jimp can't decode.
    // Transparent PNGs are flattened onto white so they don't turn black as JPEG.
    const buffer = await sharp(Buffer.from(await res.arrayBuffer()))
        .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })
        .flatten({ background: '#ffffff' })
        .jpeg({ quality: 85, mozjpeg: true })
        .toBuffer();
    return putImage(buffer, name);
}

export async function GET() {
    const left = await pending(new Set());
    const external = left.reduce((n, p) => n + p.images.filter((u) => !isOurs(u)).length, 0);
    return NextResponse.json({ products: left.length, images: external, storageConfigured: storageConfigured() });
}

export async function POST(request: Request) {
    if (!storageConfigured()) {
        return NextResponse.json({ error: 'Supabase Storage is not configured on this server.' }, { status: 500 });
    }

    // URLs that already failed this run, so a dead link can't stall the loop.
    const body = await request.json().catch(() => ({}));
    const skip = new Set<string>(Array.isArray(body?.skip) ? body.skip : []);

    const batch = (await pending(skip)).slice(0, BATCH_SIZE);
    const failed: string[] = [];
    let copied = 0;

    for (const product of batch) {
        const images = await Promise.all(
            product.images.map(async (url, i) => {
                if (isOurs(url) || skip.has(url)) return url;
                try {
                    const newUrl = await copyImage(url, `${product.slug.slice(0, 50)}-${i + 1}`);
                    copied++;
                    return newUrl;
                } catch (err) {
                    console.error(`rehost: ${url} failed:`, err);
                    failed.push(url);
                    return url; // keep the original rather than lose the image
                }
            })
        );
        await prisma.product.update({ where: { id: product.id }, data: { images } });
    }

    if (copied > 0) {
        revalidatePath('/api/products');
        revalidatePath('/product/[slug]', 'page');
        revalidatePath('/category/[slug]', 'page');
        revalidatePath('/');
    }

    const remaining = await pending(new Set([...skip, ...failed]));
    return NextResponse.json({ copied, failed, remaining: remaining.length });
}
