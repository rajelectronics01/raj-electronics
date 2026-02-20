import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { PhoneIcon } from '@/components/icons/Icons';
import styles from './ProductCard.module.css';
import Button from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <div className={styles.card}>
            <div className={styles.imageWrapper}>
                {/* Placeholder image if no real image provided, or use next/image with fallback */}
                <div className={styles.imageContainer}>
                    <Image
                        src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder.png'}
                        alt={product.name}
                        fill
                        className={styles.image}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
                {discount > 0 && (
                    <span className={styles.badge}>{discount}% OFF</span>
                )}
            </div>

            <div className={styles.content}>
                <div className={styles.brand}>{product.brand}</div>
                <h3 className={styles.title}>
                    <Link href={`/product/${product.id}`} className={styles.link}>
                        {product.name}
                    </Link>
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
                        href={`/product/${product.id}`}
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
