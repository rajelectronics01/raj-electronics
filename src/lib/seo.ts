// Single source of truth for SEO / AEO / GEO facts about the store.
// Metadata, JSON-LD, the sitemap and /llms.txt all read from here so they never disagree.

export const SITE_URL = 'https://rajelectronics.co';

export const STORE = {
    name: 'Raj Electronics',
    foundingYear: 1995,
    phone: '+919290748866',
    phoneDisplay: '+91 92907 48866',
    streetAddress: '7-1-949 Rashtrapati Rd, Bhoiguda',
    locality: 'Secunderabad',
    region: 'Telangana',
    postalCode: '500003',
    country: 'IN',
    latitude: 17.4432,
    longitude: 78.4981,
    opens: '10:30',
    closes: '21:30',
    brands: [
        'LG', 'Samsung', 'Daikin', 'Voltas', 'Blue Star', 'Lloyd', 'Whirlpool', 'Haier',
        'Godrej', 'Carrier', 'Hitachi', 'Mitsubishi', 'O-General', 'Crompton', 'Orient',
        'Symphony', 'Bajaj', 'Sansui', 'TG Smart',
    ],
    areasServed: [
        'Secunderabad', 'Hyderabad', 'RP Road', 'Rashtrapati Road', 'Bhoiguda',
        'Clock Tower Secunderabad', 'Rani Gunj', 'MG Road Secunderabad',
        'Ameerpet', 'Koti', 'Kukatpally', 'Madhapur', 'Miyapur', 'Attapur',
        'Kothapet', 'Himayat Nagar', 'RTC X Roads', 'Alwal', 'Toli Chowki',
    ],
};

export const STORE_ID = `${SITE_URL}/#store`;

export type Faq = { q: string; a: string };

export type CategorySeo = {
    name: string;           // plural, used in sentences ("air conditioners")
    h1: string;
    title: string;
    description: string;
    keywords: string;
    intro: string;
    faqs: Faq[];
};

// Per-category SEO copy. Intro + FAQs are rendered visibly on the category page
// (AEO: answer engines quote on-page answers) and mirrored as FAQPage JSON-LD.
export const CATEGORY_SEO: Record<string, CategorySeo> = {
    'air-conditioners': {
        name: 'air conditioners',
        h1: 'Air Conditioners in Secunderabad & Hyderabad',
        title: 'AC Dealer in Secunderabad | Best Price Split AC, Inverter AC | Raj Electronics',
        description: 'Buy Split AC, Inverter AC, 1 Ton & 1.5 Ton AC at best price in Secunderabad & Hyderabad. Authorized dealer for LG, Samsung, Daikin, Voltas, Blue Star. Free delivery & installation. Call +91 92907 48866.',
        keywords: 'ac dealer Secunderabad, split ac dealer Secunderabad, inverter ac dealer Secunderabad, 1 ton ac dealer Secunderabad, 1.5 ton ac dealer Secunderabad, 2 ton ac dealer Secunderabad, window ac dealer Secunderabad, air conditioner Secunderabad near me, air conditioner Secunderabad best price, air conditioner Secunderabad with installation, authorized AC dealer Secunderabad, LG ac dealer in Secunderabad, Samsung ac dealer in Secunderabad, Daikin ac dealer in Secunderabad, Voltas ac dealer in Secunderabad, Blue Star ac dealer in Secunderabad, ac dealer Hyderabad, split ac dealer Hyderabad, inverter ac dealer Hyderabad, bulk AC purchase Hyderabad, school AC supplier Hyderabad, ac showroom RP Road, ac price in Hyderabad, 5 star inverter ac price Hyderabad',
        intro: 'Raj Electronics on RP Road, Secunderabad has been an authorized AC dealer since 1995. Compare split, inverter and window ACs from LG, Samsung, Daikin, Voltas, Blue Star, Lloyd and more in 1, 1.5 and 2 ton capacities, with delivery and installation across Hyderabad and GST invoices on every purchase.',
        faqs: [
            { q: 'Which ton AC do I need for my room in Hyderabad?', a: 'As a rule of thumb, a 1 ton AC suits rooms up to about 120 sq ft, 1.5 ton suits 120–180 sq ft, and 2 ton suits 180–250 sq ft. Top-floor rooms and rooms with strong afternoon sun in Hyderabad usually need the next size up. Our staff at RP Road can size it for your room.' },
            { q: 'Is an inverter AC worth it in Hyderabad?', a: 'Yes, for most homes. Inverter ACs vary compressor speed instead of switching on and off, so they use noticeably less electricity during Hyderabad\'s long summers when the AC runs for many hours a day.' },
            { q: 'Do you install ACs at home in Hyderabad and Secunderabad?', a: 'Yes. We deliver and arrange installation for ACs across Secunderabad and Hyderabad. Call +91 92907 48866 to schedule.' },
            { q: 'Do you supply ACs in bulk for schools, hospitals and offices?', a: 'Yes. We supply split and inverter ACs in bulk to schools, hospitals, offices and housing societies across Telangana with wholesale pricing and GST billing. See our bulk orders page or call +91 92907 48866.' },
        ],
    },
    'televisions': {
        name: 'televisions',
        h1: 'Smart TVs & LED TVs in Secunderabad & Hyderabad',
        title: 'Smart TV Dealer in Secunderabad | 4K LED Google TV Best Price | Raj Electronics',
        description: 'Buy Smart TV, 4K TV, LED TV, Google TV at best price in Secunderabad & Hyderabad. Authorized dealer for Samsung, LG, Sony. Bulk TV purchase for offices & schools. Call +91 92907 48866.',
        keywords: 'smart tv dealer Secunderabad, led tv shop Secunderabad, television showroom Secunderabad, 4k tv dealer Secunderabad, Google tv dealer Secunderabad, Samsung tv dealer Secunderabad, LG tv dealer Secunderabad, smart tv Secunderabad near me, led tv Secunderabad best price, 4k tv Secunderabad near me, best tv showroom in secunderabad, bulk TV purchase for office, office tv supplier Hyderabad, where to buy lg tv in secunderabad, 43 inch smart tv price Hyderabad, 55 inch 4k tv price Hyderabad',
        intro: 'See Smart TVs, 4K TVs and Google TVs running side by side at our RP Road showroom in Secunderabad before you buy. We are an authorized dealer for Samsung, LG and other leading brands, with delivery across Hyderabad and bulk supply for offices, schools and hotels.',
        faqs: [
            { q: 'What size TV should I buy for my room?', a: 'A simple guide: for 4K TVs, sit roughly 1 to 1.5 times the screen size away. That means a 43-inch TV suits about 4–5 feet, 55-inch about 5–7 feet, and 65-inch about 6–8 feet of viewing distance.' },
            { q: 'Can I see the TV picture quality before buying?', a: 'Yes. Our showroom at 7-1-949 Rashtrapati Road, Secunderabad has TVs on live display so you can compare picture quality in person.' },
            { q: 'Do you supply TVs in bulk for offices and hotels?', a: 'Yes. We supply TVs in bulk for offices, schools, hospitals and hotels in Hyderabad with GST billing. Call +91 92907 48866 for a quote.' },
        ],
    },
    'refrigerators': {
        name: 'refrigerators',
        h1: 'Refrigerators in Secunderabad & Hyderabad',
        title: 'Refrigerator Dealer in Secunderabad | Best Price Fridge | Raj Electronics',
        description: 'Buy Double Door, Single Door & Frost Free Refrigerators at best price in Secunderabad & Hyderabad. Authorized dealer for LG, Samsung, Whirlpool. Free delivery. Call +91 92907 48866.',
        keywords: 'refrigerator dealer Secunderabad, fridge shop Secunderabad, double door refrigerator dealer Secunderabad, single door refrigerator dealer Secunderabad, frost free refrigerator dealer Secunderabad, LG refrigerator dealer Secunderabad, Samsung refrigerator dealer Secunderabad, refrigerator Secunderabad near me, refrigerator Secunderabad best price, refrigerator Hyderabad authorized dealer, side by side refrigerator Hyderabad, fridge price Hyderabad',
        intro: 'Single door, double door, frost free and side-by-side refrigerators from LG, Samsung, Whirlpool, Haier and Godrej at Raj Electronics, RP Road, Secunderabad. Authorized dealer since 1995 with delivery across Hyderabad.',
        faqs: [
            { q: 'What size refrigerator do I need for my family?', a: 'A common guide: 180–250 litres for 1–2 people, 250–350 litres for a family of 3–4, and 350 litres or more for 5 or more people.' },
            { q: 'Single door or double door — which should I buy?', a: 'Single door refrigerators are cheaper and use less power, which suits small families. Double door frost-free models do not need manual defrosting and have a larger separate freezer, which suits bigger families.' },
            { q: 'Do you deliver refrigerators in Hyderabad?', a: 'Yes. We deliver refrigerators across Secunderabad and Hyderabad. Call +91 92907 48866 to arrange delivery.' },
        ],
    },
    'washing-machines': {
        name: 'washing machines',
        h1: 'Washing Machines in Secunderabad & Hyderabad',
        title: 'Washing Machine Dealer in Secunderabad | Top & Front Load Best Price | Raj Electronics',
        description: 'Buy Top Load, Front Load, Semi & Fully Automatic Washing Machines at best price in Secunderabad. Authorized dealer for LG, Samsung, IFB, Whirlpool. Free delivery. Call +91 92907 48866.',
        keywords: 'washing machine dealer Secunderabad, top load washing machine dealer Secunderabad, front load washing machine dealer Secunderabad, semi automatic washing machine shop Secunderabad, fully automatic washing machine dealer Secunderabad, LG washing machine dealer Secunderabad, Samsung washing machine dealer Secunderabad, washing machine Secunderabad near me, washing machine Secunderabad best price, washing machine shop Hyderabad, 7 kg washing machine price Hyderabad',
        intro: 'Top load, front load, semi-automatic and fully automatic washing machines from LG, Samsung, Whirlpool and more at Raj Electronics, RP Road, Secunderabad, with delivery across Hyderabad.',
        faqs: [
            { q: 'Top load or front load washing machine — which is better?', a: 'Front load machines generally wash more gently and use less water and power. Top load machines cost less, are easier to load without bending and wash faster. Semi-automatic machines are the most affordable and work well where water supply is irregular.' },
            { q: 'What capacity washing machine do I need?', a: 'Roughly 6–7 kg for 2–3 people, 7–8 kg for a family of 4–5, and 8 kg or more for larger families or if you wash blankets at home.' },
            { q: 'Do you deliver washing machines in Hyderabad?', a: 'Yes. We deliver washing machines across Secunderabad and Hyderabad. Call +91 92907 48866.' },
        ],
    },
    'air-coolers': {
        name: 'air coolers',
        h1: 'Air Coolers in Secunderabad & Hyderabad',
        title: 'Air Cooler Dealer in Secunderabad | Desert & Tower Cooler Best Price | Raj Electronics',
        description: 'Buy Desert Air Cooler, Personal Air Cooler & Tower Air Cooler at best price in Secunderabad & Hyderabad. Authorized dealer for Symphony, Bajaj, Kenstar. Bulk orders welcome. Call +91 92907 48866.',
        keywords: 'air cooler dealer Secunderabad, air cooler shop Secunderabad, desert air cooler dealer Secunderabad, personal air cooler dealer Secunderabad, tower air cooler dealer Secunderabad, Symphony air cooler dealer Secunderabad, Bajaj air cooler dealer Secunderabad, air cooler Secunderabad near me, air cooler Secunderabad best price, air cooler bulk purchase Hyderabad, air cooler Hyderabad near me, air cooler price Hyderabad',
        intro: 'Desert, personal and tower air coolers from Symphony, Bajaj, Crompton and more at Raj Electronics, RP Road, Secunderabad. A low-cost way to beat Hyderabad\'s dry summer heat, with bulk orders welcome.',
        faqs: [
            { q: 'Does an air cooler work well in Hyderabad?', a: 'Yes. Air coolers work best in dry heat, which is typical of Hyderabad from March to June. They are less effective during the humid monsoon months, when an AC performs better.' },
            { q: 'Desert cooler or personal cooler — which should I buy?', a: 'Personal coolers suit a single small room. Desert coolers have larger tanks and stronger fans for big rooms, halls and semi-open spaces.' },
            { q: 'Can I buy air coolers in bulk?', a: 'Yes. We supply air coolers in bulk for offices, shops, schools and events in Hyderabad with GST billing. Call +91 92907 48866.' },
        ],
    },
    'water-dispensers': {
        name: 'water dispensers',
        h1: 'Water Dispensers in Secunderabad & Hyderabad',
        title: 'Water Dispenser Dealer in Secunderabad | Best Price | Raj Electronics',
        description: 'Buy Water Dispensers & Hot & Cold Water Purifiers at best price in Secunderabad & Hyderabad. Delivery available. Call +91 92907 48866.',
        keywords: 'water dispenser Secunderabad near me, water dispenser Secunderabad best price, water dispenser Hyderabad, water purifier dealer Secunderabad, water dispenser authorized dealer Secunderabad, water dispenser with delivery Secunderabad, hot and cold water dispenser Hyderabad, office water dispenser Hyderabad',
        intro: 'Hot and cold water dispensers for homes, offices and shops at Raj Electronics, RP Road, Secunderabad, with delivery across Hyderabad and bulk pricing for offices.',
        faqs: [
            { q: 'Do you have water dispensers for offices?', a: 'Yes. We stock floor-standing and tabletop hot and cold water dispensers suited to offices, and offer bulk pricing with GST billing.' },
            { q: 'Do you deliver water dispensers in Hyderabad?', a: 'Yes. We deliver across Secunderabad and Hyderabad. Call +91 92907 48866.' },
        ],
    },
    'chest-freezers': {
        name: 'chest freezers',
        h1: 'Chest Freezers in Secunderabad & Hyderabad',
        title: 'Chest Freezer Dealer in Secunderabad | Best Price | Raj Electronics',
        description: 'Buy Chest Freezers at best price in Secunderabad & Hyderabad. Ideal for commercial use. Bulk orders welcome. Call +91 92907 48866.',
        keywords: 'chest freezer Secunderabad near me, chest freezer Secunderabad best price, chest freezer dealer Secunderabad, chest freezer Hyderabad, commercial chest freezer Secunderabad, chest freezer wholesale Secunderabad, chest freezer bulk order Hyderabad, deep freezer price Hyderabad, deep freezer dealer Secunderabad',
        intro: 'Chest freezers and deep freezers for shops, restaurants, ice cream parlours and homes at Raj Electronics, RP Road, Secunderabad. Commercial and bulk orders welcome with GST billing.',
        faqs: [
            { q: 'Which chest freezer is best for a shop or restaurant?', a: 'For commercial use, choose a freezer sized for your daily stock, with a hard-top lid and a dual function (freezer and cooler) option if you store both frozen and chilled items. Our staff can suggest the right litre capacity.' },
            { q: 'Do you give GST invoices for chest freezers?', a: 'Yes. Every purchase comes with a GST invoice, so businesses can claim input tax credit.' },
        ],
    },
    'home-appliances': {
        name: 'home appliances',
        h1: 'Home Appliances in Secunderabad & Hyderabad',
        title: 'Home Appliances Store in Secunderabad | Best Price | Raj Electronics',
        description: 'Buy all Home Appliances at best price in Secunderabad & Hyderabad. AC, TV, Refrigerator, Washing Machine, Air Cooler & more. Authorized dealer since 1995. Call +91 92907 48866.',
        keywords: 'home appliances store Hyderabad, home appliances store Secunderabad, electronics dealer Secunderabad, electronics store Hyderabad near me, best electronics store in Secunderabad, appliance store Secunderabad, home appliances best price Hyderabad, electronics dealer Rashtrapati Road',
        intro: 'Everything for your home under one roof at Raj Electronics, RP Road, Secunderabad: ACs, TVs, refrigerators, washing machines, air coolers and more, from an authorized dealer since 1995.',
        faqs: [
            { q: 'Where is Raj Electronics located?', a: 'Raj Electronics is at 7-1-949 Rashtrapati Road (RP Road), Bhoiguda, Secunderabad, Telangana 500003. We are open every day from 10:30 AM to 9:30 PM.' },
            { q: 'Do you give a GST invoice?', a: 'Yes, every purchase comes with a valid GST invoice.' },
        ],
    },
    'all': {
        name: 'electronics',
        h1: 'All Electronics & Appliances at Raj Electronics',
        title: 'All Electronics in Secunderabad | Best Price | Raj Electronics',
        description: 'Buy all electronics at best price in Secunderabad & Hyderabad. Authorized dealer for AC, TV, Refrigerator, Washing Machine & more. Bulk & institutional orders welcome. Call +91 92907 48866.',
        keywords: 'electronics store Secunderabad, electronics shop Hyderabad, best electronics store in Secunderabad, electronics dealer Hyderabad, authorized electronics dealer Secunderabad, home appliances Hyderabad best price, bulk electronics supplier Secunderabad, wholesale electronics dealer Hyderabad',
        intro: 'Browse every AC, TV, refrigerator, washing machine, air cooler and appliance we stock at Raj Electronics, RP Road, Secunderabad, an authorized electronics dealer since 1995.',
        faqs: [],
    },
};

export const CATEGORY_SLUGS = Object.keys(CATEGORY_SEO);

export const formatINR = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

export const absoluteUrl = (path: string) =>
    path.startsWith('http') ? path : `${SITE_URL}${path.startsWith('/') ? '' : '/'}${encodeURI(path)}`;

// Descriptions come from the admin form / scraper and may contain HTML or long whitespace.
export const plainText = (html: string | undefined, max = 300) => {
    const text = (html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return text.length > max ? `${text.slice(0, max - 1).replace(/\s+\S*$/, '')}…` : text;
};

export const faqJsonLd = (faqs: Faq[]) => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
});

export const breadcrumbJsonLd = (items: { name: string; path: string }[]) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        item: absoluteUrl(item.path),
    })),
});

// Stringify for a <script type="application/ld+json">; escapes "<" so product text can't close the tag.
export const jsonLdString = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c');

// Map a product's free-text category ("Split AC", "LED TV"…) to its category page.
const CATEGORY_MATCHERS: [RegExp, string][] = [
    [/\b(ac|air ?condition)/i, 'air-conditioners'],
    [/\b(tv|television)/i, 'televisions'],
    [/(refrigerator|fridge)/i, 'refrigerators'],
    [/washing/i, 'washing-machines'],
    [/cooler/i, 'air-coolers'],
    [/dispenser/i, 'water-dispensers'],
    [/freezer/i, 'chest-freezers'],
];

export const categorySlugFor = (category: string): string => {
    const slug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    if (CATEGORY_SEO[slug]) return slug;
    return CATEGORY_MATCHERS.find(([re]) => re.test(category))?.[1] ?? 'home-appliances';
};
