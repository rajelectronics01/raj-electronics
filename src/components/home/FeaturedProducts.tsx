import Link from 'next/link';
import ProductCard from '@/components/product/ProductCard';
import { getFeaturedProducts } from '@/lib/products';
import styles from './FeaturedProducts.module.css';
import Button from '@/components/ui/Button';

export default async function FeaturedProducts() {
    const products = await getFeaturedProducts();

    return (
        <section className="section">
            <div className="container">
                <div className={styles.header}>
                    <h2 className={styles.title}>Featured Products</h2>
                    <Link href="/category/all">
                        <Button variant="outline">View All Products</Button>
                    </Link>
                </div>

                <div className={styles.grid}>
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}
