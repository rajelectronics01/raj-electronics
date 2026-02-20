import { getProductsByCategory } from '@/lib/products';
import ProductCard from '@/components/product/ProductCard';
import FilterSidebar from '@/components/product/FilterSidebar';
import CategoryNav from '@/components/product/CategoryNav';
import styles from './page.module.css';
import { Metadata } from 'next';

interface Props {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const categoryName = slug === 'all'
        ? 'All Products'
        : slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return {
        title: `${categoryName} - Raj Electronics`,
        description: `Shop for ${categoryName} at Raj Electronics, Secunderabad. Best prices and offers.`,
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

    // 2. Filter by Brand
    if (brandFilter) {
        const brands = Array.isArray(brandFilter) ? brandFilter : [brandFilter];
        products = products.filter(p => brands.includes(p.brand));
    }

    // 3. Filter by Price
    products = products.filter(p => p.price >= minPrice && p.price <= maxPrice);

    const categoryTitle = categorySlug === 'all'
        ? 'All Products'
        : categorySlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return (
        <div className="container section">
            <div className={styles.layout}>
                <FilterSidebar />

                <div className={styles.main}>
                    <CategoryNav />

                    <div className={styles.header}>
                        <h1 className={styles.title}>{categoryTitle}</h1>
                        <p className={styles.count}>{products.length} Products Found</p>
                    </div>

                    {products.length > 0 ? (
                        <div className={styles.grid}>
                            {products.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className={styles.noResults}>
                            <p>No products found matching your criteria.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
