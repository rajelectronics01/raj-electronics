import Image from 'next/image';
import type { Occasion, BannerProduct } from '@/lib/occasions';
import OccasionDecor, { Rangoli } from './OccasionDecor';
import styles from './OccasionBanner.module.css';

/**
 * RAJ ELECTRONICS: AUTO-GENERATED OCCASION BANNER
 *
 * A festival banner assembled at request time from three things we already
 * have: the occasion, the festival artwork, and the products currently carrying
 * the deepest discounts. Nothing is designed or uploaded for it.
 *
 * Because the prices are pulled live, the banner can never advertise a saving
 * that is no longer in the catalogue — which is the usual failure mode of a
 * hand-made JPEG banner left up too long.
 */

const formatPrice = (value: number) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(value);

/**
 * Put the best deal centre-stage.
 *
 * Products arrive ranked by discount, so rendering them in order would leave
 * the strongest offer sitting off to one side. Swapping the first two puts it
 * in the middle, where the layout raises and enlarges it.
 */
function centreBest(products: BannerProduct[]): BannerProduct[] {
    if (products.length < 2) return products;
    const [best, second, ...rest] = products;
    return [second, best, ...rest];
}

/** "2026-10-20" → "20 Oct", for the offer-ends chip. */
function endsOn(iso: string) {
    const [y, m, d] = iso.split('-').map(Number);
    if (!y || !m || !d) return '';
    return new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        month: 'short',
        timeZone: 'Asia/Kolkata',
    }).format(new Date(Date.UTC(y, m - 1, d)));
}

/** Rough EMI on a 12-month no-cost plan, rounded to something readable. */
function monthlyEmi(price: number) {
    const raw = price / 12;
    const rounded = raw >= 2000 ? Math.round(raw / 100) * 100 : Math.round(raw / 10) * 10;
    return formatPrice(rounded);
}

export default function OccasionBanner({
    occasion,
    products = [],
}: {
    occasion: Occasion;
    products?: BannerProduct[];
}) {
    const topDiscount = products.reduce((max, p) => Math.max(max, p.discount), 0);
    const cheapest = products.length ? Math.min(...products.map((p) => p.price)) : 0;

    return (
        <div className={styles.banner} data-theme={occasion.theme}>
            <div className={styles.decor} aria-hidden="true" />
            <OccasionDecor theme={occasion.theme} />

            <div className={styles.inner}>
                {/* ── Copy ── */}
                <div className={styles.copy}>
                    <p className={styles.eyebrow}>{occasion.name}</p>
                    <h2 className={styles.headline}>{occasion.headline}</h2>
                    {occasion.subline && <p className={styles.subline}>{occasion.subline}</p>}

                    <div className={styles.ctaRow}>
                        <span className={styles.cta}>
                            {occasion.ctaLabel}
                            <span className={styles.arrow} aria-hidden="true">→</span>
                        </span>
                        {cheapest > 0 && (
                            <span className={styles.emi}>
                                EMI from <strong>{monthlyEmi(cheapest)}</strong>/month
                            </span>
                        )}
                    </div>

                    <p className={styles.ends}>
                        <span className={styles.endsDot} aria-hidden="true" />
                        Offer ends <strong>{endsOn(occasion.end)}</strong> · Free delivery &amp; installation
                    </p>
                </div>

                {/* ── Live product showcase ── */}
                {products.length > 0 && (
                    <div className={styles.showcase}>
                        {topDiscount > 0 && (
                            <div className={styles.badge}>
                                <span className={styles.badgeUpto}>Up to</span>
                                <span className={styles.badgePct}>{topDiscount}%</span>
                                <span className={styles.badgeOff}>off</span>
                            </div>
                        )}

                        <div className={styles.stage}>
                            <Rangoli className={styles.rangoli} />

                            <div className={styles.products}>
                                {centreBest(products).map((product, i) => (
                                    <div
                                        key={product.id}
                                        className={`${styles.product} ${
                                            i === 1 ? styles.productLead : ''
                                        }`}
                                    >
                                        <div className={styles.productShot}>
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                fill
                                                sizes="160px"
                                                // The banner is the first slide, so these are
                                                // above the fold — lazy-loading leaves holes.
                                                loading="eager"
                                                className={styles.productImg}
                                            />
                                            {product.discount > 0 && (
                                                <span className={styles.productOff}>
                                                    {product.discount}% off
                                                </span>
                                            )}
                                        </div>
                                        <p className={styles.productPrice}>
                                            {formatPrice(product.price)}
                                            {product.originalPrice ? (
                                                <s className={styles.productWas}>
                                                    {formatPrice(product.originalPrice)}
                                                </s>
                                            ) : null}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className={styles.brand} aria-hidden="true">
                Raj Electronics
                <span className={styles.brandSub}>RP Road, Secunderabad</span>
            </div>
        </div>
    );
}
