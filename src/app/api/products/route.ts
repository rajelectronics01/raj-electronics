import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { Product } from '@/types';

const dataFilePath = path.join(process.cwd(), 'src/data/products.json');

async function getProducts() {
    const jsonData = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(jsonData) as Product[];
}

async function saveProducts(products: Product[]) {
    await fs.writeFile(dataFilePath, JSON.stringify(products, null, 2));
}

export async function GET() {
    try {
        const products = await getProducts();
        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log('API POST - Received:', body);
        const newProduct = {
            ...body,
            id: Date.now().toString(), // Simple ID generation
            slug: body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
        };

        const products = await getProducts();
        products.push(newProduct);
        await saveProducts(products);

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save product' }, { status: 500 });
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

        const products = await getProducts();
        const index = products.findIndex(p => p.id === id);

        if (index === -1) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        const updatedProduct = { ...products[index], ...updates };

        // Update slug if name changed
        if (updates.name && updates.name !== products[index].name) {
            updatedProduct.slug = updates.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        }

        products[index] = updatedProduct;
        await saveProducts(products);

        return NextResponse.json(updatedProduct);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}
