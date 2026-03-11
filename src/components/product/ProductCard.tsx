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
                {product.originalPrice && discount > 0 && (
                    <div className={styles.badge}>{discount}% OFF</div>
                )}

                <div className={styles.imageContainer}>
                    <Link href={`/product/${product.slug}`} className={styles.link} style={{ width: '100%', height: '100%', display: 'block' }}>
                        {product.images?.[0] ? (
                            <ImageScrubber 
                                images={product.images}
                                alt={`${product.brand} ${product.name} - best price at Raj Electronics`}
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
                    >{product.name}</Link>
                </h3>

                <div className={styles.priceContainer}>
                    <span className={styles.price}>{formatPrice(product.price)}</span>
                    {product.originalPrice && (
                        <span className={styles.originalPrice}>{formatPrice(product.originalPrice)}</span>
                    )}
                </div>

                <div className={styles.emiBadge}>EMI Available</div>

                <div className={styles.actionRow}>
                    <Button
                        href="tel:+919290748866"
                        variant="outline"
                        size="sm"
                        style={{ width: '100%' }}
                    >
                        <PhoneIcon width={16} height={16} style={{ marginRight: '5px' }} /> Call
                    </Button>
                    <Button
                        href={`/product/${product.slug}`}
                        variant="primary"
                        size="sm"
                        className={styles.enquireBtn}
                        style={{ width: '100%' }}
                    >
                        View Details
                    </Button>
                </div>
            </div>
        </div>
    );
}
