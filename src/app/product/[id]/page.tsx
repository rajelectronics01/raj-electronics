import ProductGallery from '@/components/product/ProductGallery';


import { notFound } from 'next/navigation';
import { getProductById, getProductsByCategory } from '@/lib/products';
import { formatPrice } from '@/lib/utils';
import Button from '@/components/ui/Button';
import ProductCard from '@/components/product/ProductCard';
import styles from './page.module.css';
import { Metadata } from 'next';
import { PhoneIcon, MapPinIcon } from '@/components/icons/Icons';

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
        return { title: 'Product Not Found' };
    }

    return {
        title: `${product.name} - Raj Electronics`,
        description: `Buy ${product.name} at best price in Secunderabad. ${product.features.join(', ')}.`,
    };
}

export default async function ProductPage(props: Props) {
    const params = await props.params;
    const product = await getProductById(params.id);

    if (!product) {
        notFound();
    }

    const relatedProducts = (await getProductsByCategory(product.category))
        .filter(p => p.id !== product.id)
        .slice(0, 4);

    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <div className="container section">
            <div className={styles.productLayout}>
                {/* Gallery Section */}
                <div className={styles.gallery}>
                    <ProductGallery images={product.images || []} name={product.name} />
                </div>

                {/* Info Section */}
                <div className={styles.info}>
                    <div className={styles.brand}>{product.brand}</div>
                    <h1 className={styles.title}>{product.name}</h1>

                    <div className={styles.priceContainer}>
                        <span className={styles.price}>{formatPrice(product.price)}</span>
                        {product.originalPrice && (
                            <span className={styles.originalPrice}>{formatPrice(product.originalPrice)}</span>
                        )}
                        {discount > 0 && <span className={styles.discountBadge}>{discount}% OFF</span>}
                    </div>

                    <p className={styles.emiText}>No Cost EMI Available. Standard EMI starts at ₹2,100/mo.</p>

                    <div className={styles.features}>
                        <h3>Key Features</h3>
                        <ul>
                            {product.features.map((feature, idx) => (
                                <li key={idx}>{feature}</li>
                            ))}
                        </ul>
                    </div>

                    <div className={styles.actions}>
                        <Button
                            href="tel:+919290748866"
                            size="lg"
                            style={{ flex: 1, width: '100%' }}
                        >
                            <PhoneIcon style={{ marginRight: '10px' }} /> Call for Best Price
                        </Button>
                        <Button
                            href="https://maps.google.com/?q=Raj+Electronics+Secunderabad"
                            target="_blank"
                            size="lg"
                            variant="outline"
                            style={{ flex: 1, width: '100%' }}
                        >
                            <MapPinIcon style={{ marginRight: '10px' }} /> Visit Store
                        </Button>
                    </div>

                    <p className={styles.storeNote}>
                        * Prices may vary in-store. Visit Raj Electronics, Secunderabad for live demo and best deals.
                    </p>
                </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className={styles.relatedSection}>
                    <h2 className={styles.relatedTitle}>Related Products</h2>
                    <div className={styles.relatedGrid}>
                        {relatedProducts.map(p => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
