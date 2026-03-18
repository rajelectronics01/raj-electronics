import { getProductsByCategory } from '@/lib/products';
import ProductCard from '@/components/product/ProductCard';
import FilterSidebar from '@/components/product/FilterSidebar';
import CategoryNav from '@/components/product/CategoryNav';
import styles from './page.module.css';
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

    const categoryDescriptions: Record<string, string> = {
        'air-conditioners': `Buy Split & Window Air Conditioners at best price in Secunderabad. Raj Electronics is an authorized dealer for LG, Voltas, Daikin, Samsung, Carrier, O-General, Hitachi & Mitsubishi ACs. 1 Ton, 1.5 Ton & 2 Ton inverter ACs available with easy EMI. Visit us on RP Road, Secunderabad.`,
        'air-coolers':      `Shop Air Coolers in Secunderabad at lowest prices. Personal, tower & desert air coolers from Crompton, Orient, Symphony & more. Best air cooler deals near you on RP Road, Hyderabad.`,
        'televisions':      `Buy LED & Smart TVs at best price in Secunderabad. 32", 43", 55" & 65" 4K Smart TVs from Samsung, LG, Sony, Sansui & more at Raj Electronics, RP Road. EMI available.`,
        'refrigerators':    `Refrigerators at lowest price in Secunderabad. Single door, double door & side-by-side models from LG, Samsung, Whirlpool, Godrej & Haier. Visit Raj Electronics on RP Road.`,
        'washing-machines': `Washing Machines at best price in Secunderabad. Fully automatic front-load & top-load washers from LG, Samsung, Whirlpool, Panasonic & more. EMI available at Raj Electronics.`,
        'home-appliances':  `Home Appliances at Raj Electronics, Secunderabad. Mixers, microwaves, voltage stabilizers, geysers & more from top brands. Best prices on RP Road, Hyderabad.`,
        'water-dispensers': `Water Dispensers & Purifiers in Secunderabad at lowest price. Hot & cold water dispensers from top brands available at Raj Electronics, RP Road.`,
        'chest-freezers':   `Chest Freezers & Deep Freezers at best price in Secunderabad. Commercial & home deep freezers from trusted brands. Visit Raj Electronics on RP Road, Hyderabad.`,
        'mobile-phones':    `Buy Mobile Phones & Smartphones at best price in Secunderabad. Latest Android & iOS phones from Samsung, Vivo, Oppo & more at Raj Electronics, RP Road.`,
        'all':              `Shop all electronics at Raj Electronics, RP Road Secunderabad — Air Conditioners, Smart TVs, Air Coolers, Refrigerators, Washing Machines, Mobile Phones & more at best prices with EMI.`,
    };

    const categoryKeywords: Record<string, string> = {
        'air-conditioners': 'buy AC Secunderabad, split AC price Hyderabad, 1.5 ton AC Secunderabad, inverter AC dealer, Voltas AC Secunderabad, LG AC dealer RP Road, Daikin AC Hyderabad, Carrier AC price, O-General AC dealer, Samsung AC Secunderabad',
        'air-coolers':      'air cooler price Secunderabad, desert air cooler Hyderabad, personal air cooler RP Road, Crompton cooler, Symphony cooler dealer Secunderabad',
        'televisions':      '4K TV price Secunderabad, Smart TV dealer Hyderabad, LED TV shop RP Road, Samsung TV Secunderabad, LG TV dealer, 43 inch TV price Hyderabad',
        'refrigerators':    'refrigerator price Secunderabad, double door fridge dealer Hyderabad, LG fridge RP Road, Samsung fridge Secunderabad, Whirlpool refrigerator',
        'washing-machines': 'washing machine price Secunderabad, fully automatic washer Hyderabad, LG washing machine RP Road, Samsung washer dealer, front load washing machine',
        'home-appliances':  'home appliances Secunderabad, voltage stabilizer dealer Hyderabad, microwave oven RP Road, mixer grinder Secunderabad',
        'water-dispensers': 'water dispenser price Secunderabad, hot cold water dispenser Hyderabad, water cooler dealer RP Road',
        'chest-freezers':   'chest freezer price Secunderabad, deep freezer dealer Hyderabad, commercial freezer RP Road',
        'mobile-phones':    'mobile phone shop Secunderabad, smartphone price Hyderabad, Samsung phone dealer RP Road, buy phone Secunderabad',
        'all':              'electronics shop Secunderabad, buy electronics RP Road, home appliances dealer Hyderabad, authorized electronics dealer Secunderabad',
    };

    const desc = categoryDescriptions[slug] || `Shop for ${categoryName} at Raj Electronics, Secunderabad. Best prices on RP Road with easy EMI. Authorised dealer for top brands.`;
    const keywords = categoryKeywords[slug] || `${categoryName} price Secunderabad, ${categoryName} dealer Hyderabad, buy ${categoryName} RP Road`;

    return {
        title: slug === 'all'
            ? 'All Electronics Products — Raj Electronics Secunderabad | Best Price RP Road'
            : `Best ${categoryName} Price in Secunderabad | Raj Electronics RP Road`,
        description: desc,
        keywords,
        openGraph: {
            title: `${categoryName} — Raj Electronics Secunderabad`,
            description: desc,
            locale: 'en_IN',
            type: 'website',
        },
        alternates: {
            canonical: `https://rajelectronics.co/category/${slug}`,
        },
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

    // Get all unique brands available in this category BEFORE applying brand filters
    const uniqueBrands = Array.from(new Set(products.map(p => p.brand))).filter(Boolean).sort();

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
                <FilterSidebar brands={uniqueBrands} />

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
