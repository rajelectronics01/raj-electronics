import { getProductsByCategory } from '@/lib/products';
import CategoryPageClient from './CategoryPageClient';
import { Metadata } from 'next';

export const revalidate = 3600;

interface Props {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Per-category SEO config derived from keyword masterlist
const CATEGORY_SEO: Record<string, { title: string; description: string; keywords: string }> = {
    'air-conditioners': {
        title: 'AC Dealer in Secunderabad | Best Price Split AC, Inverter AC | Raj Electronics',
        description: 'Buy Split AC, Inverter AC, 1 Ton & 1.5 Ton AC at best price in Secunderabad & Hyderabad. Authorized dealer for LG, Samsung, Daikin, Voltas, Blue Star. Free delivery & installation. Call +91 92907 48866.',
        keywords: 'ac dealer Secunderabad, split ac dealer Secunderabad, inverter ac dealer Secunderabad, 1 ton ac dealer Secunderabad, 1.5 ton ac dealer Secunderabad, 2 ton ac dealer Secunderabad, window ac dealer Secunderabad, air conditioner Secunderabad near me, air conditioner Secunderabad best price, air conditioner Secunderabad with installation, authorized AC dealer Secunderabad, LG ac dealer in Secunderabad, Samsung ac dealer in Secunderabad, Daikin ac dealer in Secunderabad, Voltas ac dealer in Secunderabad, Blue Star ac dealer in Secunderabad, ac dealer Hyderabad, split ac dealer Hyderabad, inverter ac dealer Hyderabad, bulk AC purchase Hyderabad, school AC supplier Hyderabad',
    },
    'televisions': {
        title: 'Smart TV Dealer in Secunderabad | 4K LED Google TV Best Price | Raj Electronics',
        description: 'Buy Smart TV, 4K TV, LED TV, Google TV at best price in Secunderabad & Hyderabad. Authorized dealer for Samsung, LG, Sony. Bulk TV purchase for offices & schools. Call +91 92907 48866.',
        keywords: 'smart tv dealer Secunderabad, led tv shop Secunderabad, television showroom Secunderabad, 4k tv dealer Secunderabad, Google tv dealer Secunderabad, Samsung tv dealer Secunderabad, LG tv dealer Secunderabad, smart tv Secunderabad near me, led tv Secunderabad best price, 4k tv Secunderabad near me, best tv showroom in secunderabad, bulk TV purchase for office, office tv supplier Hyderabad, where to buy lg tv in secunderabad',
    },
    'refrigerators': {
        title: 'Refrigerator Dealer in Secunderabad | Best Price Fridge | Raj Electronics',
        description: 'Buy Double Door, Single Door & Frost Free Refrigerators at best price in Secunderabad & Hyderabad. Authorized dealer for LG, Samsung, Whirlpool. Free delivery. Call +91 92907 48866.',
        keywords: 'refrigerator dealer Secunderabad, fridge shop Secunderabad, double door refrigerator dealer Secunderabad, single door refrigerator dealer Secunderabad, frost free refrigerator dealer Secunderabad, LG refrigerator dealer Secunderabad, Samsung refrigerator dealer Secunderabad, refrigerator Secunderabad near me, refrigerator Secunderabad best price, refrigerator Hyderabad authorized dealer',
    },
    'washing-machines': {
        title: 'Washing Machine Dealer in Secunderabad | Top & Front Load Best Price | Raj Electronics',
        description: 'Buy Top Load, Front Load, Semi & Fully Automatic Washing Machines at best price in Secunderabad. Authorized dealer for LG, Samsung, IFB, Whirlpool. Free delivery. Call +91 92907 48866.',
        keywords: 'washing machine dealer Secunderabad, top load washing machine dealer Secunderabad, front load washing machine dealer Secunderabad, semi automatic washing machine shop Secunderabad, fully automatic washing machine dealer Secunderabad, LG washing machine dealer Secunderabad, Samsung washing machine dealer Secunderabad, washing machine Secunderabad near me, washing machine Secunderabad best price, washing machine shop Hyderabad',
    },
    'air-coolers': {
        title: 'Air Cooler Dealer in Secunderabad | Desert & Tower Cooler Best Price | Raj Electronics',
        description: 'Buy Desert Air Cooler, Personal Air Cooler & Tower Air Cooler at best price in Secunderabad & Hyderabad. Authorized dealer for Symphony, Bajaj, Kenstar. Bulk orders welcome. Call +91 92907 48866.',
        keywords: 'air cooler dealer Secunderabad, air cooler shop Secunderabad, desert air cooler dealer Secunderabad, personal air cooler dealer Secunderabad, tower air cooler dealer Secunderabad, Symphony air cooler dealer Secunderabad, Bajaj air cooler dealer Secunderabad, air cooler Secunderabad near me, air cooler Secunderabad best price, air cooler bulk purchase Hyderabad, air cooler Hyderabad near me',
    },
    'water-dispensers': {
        title: 'Water Dispenser Dealer in Secunderabad | Best Price | Raj Electronics',
        description: 'Buy Water Dispensers & Hot & Cold Water Purifiers at best price in Secunderabad & Hyderabad. Delivery available. Call +91 92907 48866.',
        keywords: 'water dispenser Secunderabad near me, water dispenser Secunderabad best price, water dispenser Hyderabad, water purifier dealer Secunderabad, water dispenser authorized dealer Secunderabad, water dispenser with delivery Secunderabad',
    },
    'chest-freezers': {
        title: 'Chest Freezer Dealer in Secunderabad | Best Price | Raj Electronics',
        description: 'Buy Chest Freezers at best price in Secunderabad & Hyderabad. Ideal for commercial use. Bulk orders welcome. Call +91 92907 48866.',
        keywords: 'chest freezer Secunderabad near me, chest freezer Secunderabad best price, chest freezer dealer Secunderabad, chest freezer Hyderabad, commercial chest freezer Secunderabad, chest freezer wholesale Secunderabad, chest freezer bulk order Hyderabad',
    },
    'home-appliances': {
        title: 'Home Appliances Store in Secunderabad | Best Price | Raj Electronics',
        description: 'Buy all Home Appliances at best price in Secunderabad & Hyderabad. AC, TV, Refrigerator, Washing Machine, Air Cooler & more. Authorized dealer since 1995. Call +91 92907 48866.',
        keywords: 'home appliances store Hyderabad, home appliances store Secunderabad, electronics dealer Secunderabad, electronics store Hyderabad near me, best electronics store in Secunderabad, appliance store Secunderabad, home appliances best price Hyderabad, electronics dealer Rashtrapati Road',
    },
    'all': {
        title: 'All Electronics in Secunderabad | Best Price | Raj Electronics',
        description: 'Buy all electronics at best price in Secunderabad & Hyderabad. Authorized dealer for AC, TV, Refrigerator, Washing Machine & more. Bulk & institutional orders welcome. Call +91 92907 48866.',
        keywords: 'electronics store Secunderabad, electronics shop Hyderabad, best electronics store in Secunderabad, electronics dealer Hyderabad, authorized electronics dealer Secunderabad, home appliances Hyderabad best price, bulk electronics supplier Secunderabad, wholesale electronics dealer Hyderabad',
    },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const seo = CATEGORY_SEO[slug];

    if (seo) {
        return {
            title: seo.title,
            description: seo.description,
            keywords: seo.keywords,
            alternates: { canonical: `https://rajelectronics.co/category/${slug}` },
            openGraph: {
                title: seo.title,
                description: seo.description,
                url: `https://rajelectronics.co/category/${slug}`,
                siteName: 'Raj Electronics',
                type: 'website',
                locale: 'en_IN',
            },
        };
    }

    // Fallback for unknown slugs
    const categoryName = slug.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    return {
        title: `${categoryName} in Secunderabad | Best Price | Raj Electronics`,
        description: `Buy ${categoryName} at best price in Secunderabad & Hyderabad. Authorized dealer. Call +91 92907 48866.`,
        alternates: { canonical: `https://rajelectronics.co/category/${slug}` },
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
