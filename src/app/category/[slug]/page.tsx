import { getProductsByCategory } from '@/lib/products';
import CategoryPageClient from './CategoryPageClient';
import { Metadata } from 'next';

export const revalidate = 3600;

interface Props {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    const categoryName = slug === 'all'
        ? 'All Products'
        : slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    const desc = slug === 'all' 
        ? "Buy all electronics at best price in Secunderabad & Hyderabad. Authorized dealer. Electronics for home, office & bulk orders. Call +91 92907 48866." 
        : `Buy ${categoryName} at best price in Secunderabad & Hyderabad. Authorized dealer. Call +91 92907 48866.`;

    return {
        title: slug === 'all'
            ? 'All Electronics in Secunderabad | Best Price | Raj Electronics'
            : `${categoryName} in Secunderabad | Best Price | Raj Electronics`,
        description: desc,
    };
}

export default async function CategoryPage(props: Props) {
    const params = await props.params;
    const searchParams = await props.searchParams;

    const categorySlug = params.slug;
    const brandFilter = searchParams.brand;
    const minPrice = searchParams.min ? parseInt(searchParams.min as string) : 0;
    const maxPrice = searchParams.max ? parseInt(searchParams.max as string) : Infinity;

    // 1. Fetch by category
    let products = await getProductsByCategory(categorySlug);

    // Get all unique brands
    const uniqueBrands = Array.from(new Set(products.map(p => p.brand))).filter(Boolean).sort();

    // 2. Filter by Brand
    if (brandFilter) {
        const brands = Array.isArray(brandFilter) ? brandFilter : [brandFilter];
        products = products.filter(p => brands.includes(p.brand));
    }

    // 3. Filter by Price
    products = products.filter(p => !isNaN(p.price) && p.price >= minPrice && p.price <= maxPrice);

    return (
        <CategoryPageClient 
            params={params} 
            searchParams={searchParams} 
            initialProducts={products} 
            uniqueBrands={uniqueBrands} 
        />
    );
}
