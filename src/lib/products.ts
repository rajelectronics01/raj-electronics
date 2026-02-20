import { Product } from '@/types';
import productsData from '@/data/products.json';

export async function getProducts(): Promise<Product[]> {
    // Simulate API delay or database fetch
    return productsData as Product[];
}

export async function getFeaturedProducts(): Promise<Product[]> {
    const allProducts = await getProducts();
    return allProducts.filter(p => p.isFeatured);
}

export async function getProductById(id: string): Promise<Product | undefined> {
    const allProducts = await getProducts();
    return allProducts.find(p => p.id === id);
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
    const allProducts = await getProducts();
    if (category === 'all') return allProducts;
    // Simple slug matching for now, ideally strictly match category names
    return allProducts.filter(p => p.category.toLowerCase().replace(/\s+/g, '-') === category || p.category === category);
}
