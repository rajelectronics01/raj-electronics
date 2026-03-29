import Link from 'next/link';
import { Product } from '@/types';
import { PhoneIcon } from '@/components/icons/Icons';
import styles from './ProductCard.module.css';
import Button from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import ImageScrubber from './ImageScrubber';

interface ProductCardProps {
    product: Product;
    priority?: boolean;
}

export default function ProductCard({ product, priority }: ProductCardProps) {
    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <div className={styles.card}>
            <div className={styles.imageWrapper}>
                <div className={styles.imageContainer}>
                    <Link href={`/product/${product.slug}`} className={styles.link} style={{ width: '100%', height: '100%', display: 'block' }}>
                        {product.images?.[0] ? (
                            <ImageScrubber 
                                images={product.images}
                                alt={`${product.brand} ${product.name} - Buy in Secunderabad Hyderabad`}
                                priority={priority}
                            />
                        ) : (
                            <div className={styles.placeholderImage} />
                        )}
                    </Link>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.brand}>{product.brand}</div>

                <h3 className={styles.title}>
                    <Link
                        href={`/product/${product.slug}`}
                        className={styles.titleLink}
                        title={product.name}
                    >
                        {product.name.length > 60 ? product.name.substring(0, 57) + '...' : product.name}
                    </Link>
                </h3>

                <div className={styles.priceContainer}>
                    <span className={styles.price}>{formatPrice(product.price)}</span>
                    {product.originalPrice && (
                        <>
                            <span className={styles.originalPrice}>{formatPrice(product.originalPrice)}</span>
                            <span className={styles.discountPillSmall}>{discount}% Off</span>
                        </>
                    )}
                </div>

                <div className={styles.actionRow}>
                    <Button
                        href={`/product/${product.slug}`}
                        variant="primary"
                        size="sm"
                        className={styles.cartBtn}
                        style={{ width: '100%', background: '#fff', color: '#000', border: '1px solid #000' }}
                    >
                        Add to Cart
                    </Button>
                    <Button
                        href="tel:+919290748866"
                        variant="primary"
                        size="sm"
                        className={styles.callBtn}
                        style={{ width: '100%', background: '#1e293b', border: 'none' }}
                    >
                         Call Us
                    </Button>
                </div>
            </div>
        </div>
    );
}
