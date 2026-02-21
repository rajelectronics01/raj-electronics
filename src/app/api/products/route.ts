import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(products);
    } catch (error) {
        console.error("Prisma GET Error:", error);
        return NextResponse.json({ error: 'Failed to fetch products from Supabase' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log('API POST - Received:', body);

        const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

        const newProduct = await prisma.product.create({
            data: {
                name: body.name,
                slug: slug,
                brand: body.brand || "Generic",
                category: body.category || "Uncategorized",
                price: parseFloat(body.price),
                originalPrice: body.originalPrice ? parseFloat(body.originalPrice) : null,
                description: body.description || "",
                images: body.images || [],
                features: body.features || [],
                inStock: body.inStock !== undefined ? body.inStock : true,
            }
        });

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        console.error("Prisma POST Error:", error);
        return NextResponse.json({ error: 'Failed to save product to Supabase' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        console.log('API PUT - Received:', body);
        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
        }

        let newSlug = updates.slug;
        if (updates.name) {
            newSlug = updates.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        }

        const dataPayload: any = { ...updates };
        if (newSlug) dataPayload.slug = newSlug;
        if (updates.price !== undefined) dataPayload.price = parseFloat(updates.price);
        if (updates.originalPrice !== undefined) dataPayload.originalPrice = updates.originalPrice ? parseFloat(updates.originalPrice) : null;

        // Exclude strictly internal prisma timestamps
        delete dataPayload.createdAt;
        delete dataPayload.updatedAt;

        const updatedProduct = await prisma.product.update({
            where: { id: id },
            data: dataPayload
        });

        return NextResponse.json(updatedProduct);
    } catch (error) {
        console.error("Prisma PUT Error:", error);
        return NextResponse.json({ error: 'Failed to update product in Supabase' }, { status: 500 });
    }
}
