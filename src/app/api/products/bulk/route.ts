import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';

// Fields the Quick Edit sheet is allowed to change. Slug is deliberately left out:
// renaming a product keeps its URL so pages Google has already indexed don't 404.
type BulkUpdate = {
    id: string;
    name?: string;
    brand?: string;
    category?: string;
    price?: number | string;
    originalPrice?: number | string | null;
    inStock?: boolean;
    isFeatured?: boolean;
};

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const updates: BulkUpdate[] = Array.isArray(body?.updates) ? body.updates : [];

        if (updates.length === 0) {
            return NextResponse.json({ error: 'No changes to save' }, { status: 400 });
        }

        const errors: string[] = [];
        const operations = updates.map((u) => {
            if (!u.id) errors.push('A row is missing its product ID');

            const data: Record<string, unknown> = {};
            if (u.name !== undefined) {
                if (!String(u.name).trim()) errors.push(`Product ${u.id}: name cannot be empty`);
                data.name = String(u.name).trim();
            }
            if (u.brand !== undefined) data.brand = String(u.brand).trim();
            if (u.category !== undefined) data.category = String(u.category).trim();
            if (u.price !== undefined) {
                const price = parseFloat(String(u.price));
                if (!Number.isFinite(price) || price < 0) errors.push(`${u.name ?? u.id}: invalid price`);
                data.price = price;
            }
            if (u.originalPrice !== undefined) {
                if (u.originalPrice === null || u.originalPrice === '') {
                    data.originalPrice = null;
                } else {
                    const mrp = parseFloat(String(u.originalPrice));
                    if (!Number.isFinite(mrp) || mrp < 0) errors.push(`${u.name ?? u.id}: invalid MRP`);
                    data.originalPrice = mrp;
                }
            }
            if (u.inStock !== undefined) data.inStock = Boolean(u.inStock);
            if (u.isFeatured !== undefined) data.isFeatured = Boolean(u.isFeatured);

            return prisma.product.update({ where: { id: u.id }, data });
        });

        if (errors.length > 0) {
            return NextResponse.json({ error: errors.join('\n') }, { status: 400 });
        }

        // All-or-nothing: either every row saves or none do.
        const saved = await prisma.$transaction(operations);

        // Product, category and listing pages are cached for an hour; refresh them now
        // so new prices show on the site immediately.
        revalidatePath('/api/products');
        revalidatePath('/product/[slug]', 'page');
        revalidatePath('/category/[slug]', 'page');
        revalidatePath('/');

        return NextResponse.json({ saved: saved.length });
    } catch (error) {
        console.error('Prisma BULK PATCH Error:', error);
        return NextResponse.json({ error: 'Failed to save changes' }, { status: 500 });
    }
}
