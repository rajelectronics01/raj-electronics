import type { Occasion, OccasionTheme } from './occasions';

/**
 * RAJ ELECTRONICS: BANNER STUDIO TEMPLATES
 *
 * The design system behind Admin → Banner Studio: the layouts a banner can be
 * built from, the colour schemes it can wear, and a plain-English reader that
 * turns "washing machine sale 40% off this weekend" into a finished design.
 *
 * Everything here is pure data and string handling — no DB, no network — so
 * the studio previews exactly what the homepage will render, and a banner can
 * still be drafted when the AI copywriter is unavailable.
 */

/* ─────────────────────────── Layouts ─────────────────────────── */

export type BannerLayout = 'spotlight' | 'poster' | 'coupon' | 'split' | 'price';

export interface LayoutOption {
    id: BannerLayout;
    name: string;
    /** What it is good for, in the shop's language rather than a designer's. */
    note: string;
}

export const LAYOUTS: LayoutOption[] = [
    {
        id: 'spotlight',
        name: 'Spotlight',
        note: 'Offer on the left, three products lit on a stage. The all-rounder.',
    },
    {
        id: 'poster',
        name: 'Poster',
        note: 'Big centred headline, products beneath. Best for festivals.',
    },
    {
        id: 'coupon',
        name: 'Coupon',
        note: 'Looks like a tear-off voucher. Best for exchange and sale weeks.',
    },
    {
        id: 'split',
        name: 'Split',
        note: 'Diagonal colour block with the brand mark large. Best for brand weeks.',
    },
    {
        id: 'price',
        name: 'Price Lead',
        note: 'One product, one huge price. Best when the deal is the story.',
    },
];

/* ─────────────────────────── Background art ─────────────────────────── */

/**
 * The pattern washed behind the festival motifs. Keeps two banners in the same
 * colours from looking like the same banner.
 */
export type BannerPattern = 'none' | 'rays' | 'dots' | 'arcs' | 'grid';

export const PATTERNS: Array<{ id: BannerPattern; name: string }> = [
    { id: 'none', name: 'Plain' },
    { id: 'rays', name: 'Sunburst' },
    { id: 'dots', name: 'Halftone' },
    { id: 'arcs', name: 'Arcs' },
    { id: 'grid', name: 'Grid' },
];

/* ─────────────────────────── Colour schemes ─────────────────────────── */

/**
 * The themes, named for a shopkeeper rather than a developer. The ids are the
 * same OccasionTheme values the festival banners use, so a scheme picked here
 * renders through exactly the same CSS.
 */
export const PALETTES: Array<{ id: OccasionTheme; name: string; group: string }> = [
    { id: 'diwali', name: 'Diwali purple & gold', group: 'Festival' },
    { id: 'dussehra', name: 'Dussehra blue & orange', group: 'Festival' },
    { id: 'ganesh', name: 'Ganesh saffron', group: 'Festival' },
    { id: 'sankranti', name: 'Sankranti sky', group: 'Festival' },
    { id: 'ugadi', name: 'Ugadi green', group: 'Festival' },
    { id: 'holi', name: 'Holi pink', group: 'Festival' },
    { id: 'eid', name: 'Eid emerald', group: 'Festival' },
    { id: 'newyear', name: 'New Year midnight', group: 'Festival' },
    { id: 'tricolour', name: 'Tricolour', group: 'Festival' },
    { id: 'summer', name: 'Cooling blue', group: 'Category' },
    { id: 'washer', name: 'Laundry navy', group: 'Category' },
    { id: 'cooler', name: 'Cooler teal', group: 'Category' },
    { id: 'fridge', name: 'Frost steel', group: 'Category' },
    { id: 'tv', name: 'Cinema violet', group: 'Category' },
    { id: 'kitchen', name: 'Kitchen terracotta', group: 'Category' },
    { id: 'sale', name: 'Sale blue', group: 'Category' },
    { id: 'tgsmart', name: 'TG Smart mint', group: 'Brand' },
    { id: 'crompton', name: 'Crompton red', group: 'Brand' },
];

/* ─────────────────────────── A finished design ─────────────────────────── */

export interface BannerDesign {
    id: string;
    /** Small line above the headline. */
    eyebrow: string;
    headline: string;
    subline: string;
    ctaLabel: string;
    href: string;
    theme: OccasionTheme;
    layout: BannerLayout;
    pattern: BannerPattern;
    /** Product.category the showcase draws from; 'all' for store-wide. */
    productCategory?: string;
    /** Product.brand the showcase draws from, on a brand banner. */
    brand?: string;
    /** Brand mark shown above the headline. */
    logo?: string;
    /** What a screen reader and Google get. Written for every banner. */
    alt: string;
    /** Last day of the offer, `YYYY-MM-DD`. */
    endsOn: string;
}

/** Render a design through the same component the festival banners use. */
export function designToOccasion(design: BannerDesign): Occasion {
    return {
        id: design.id,
        name: design.eyebrow,
        headline: design.headline,
        subline: design.subline,
        ctaLabel: design.ctaLabel,
        href: design.href,
        theme: design.theme,
        layout: design.layout,
        pattern: design.pattern,
        productCategory: design.productCategory,
        brand: design.brand,
        logo: design.logo,
        alt: design.alt,
        // The studio banner runs until its end date; the start is irrelevant
        // because it is placed in the slider by hand rather than by calendar.
        start: '1970-01-01',
        end: design.endsOn,
    };
}

/* ─────────────────────────── Reading the prompt ─────────────────────────── */

interface CategoryRule {
    category: string;
    slug: string;
    theme: OccasionTheme;
    /** Words that mean this category, lowercase. */
    words: string[];
    /** Plural noun used in generated copy. */
    noun: string;
}

const CATEGORY_RULES: CategoryRule[] = [
    {
        category: 'Washing Machines',
        slug: 'washing-machines',
        theme: 'washer',
        words: ['washing machine', 'washer', 'laundry', 'front load', 'top load'],
        noun: 'washing machines',
    },
    {
        category: 'Air Coolers',
        slug: 'air-coolers',
        theme: 'cooler',
        words: ['cooler', 'air cooler', 'desert cooler', 'tower cooler'],
        noun: 'air coolers',
    },
    {
        category: 'Air Conditioners',
        slug: 'air-conditioners',
        theme: 'summer',
        words: ['ac', 'a/c', 'air conditioner', 'split ac', 'window ac', 'inverter ac'],
        noun: 'air conditioners',
    },
    {
        category: 'Refrigerators',
        slug: 'refrigerators',
        theme: 'fridge',
        words: ['fridge', 'refrigerator', 'double door', 'side by side', 'freezer'],
        noun: 'refrigerators',
    },
    {
        category: 'Televisions',
        slug: 'televisions',
        theme: 'tv',
        words: ['tv', 'television', 'smart tv', 'led tv', 'oled', 'google tv'],
        noun: 'smart TVs',
    },
    {
        category: 'Home Appliances',
        slug: 'home-appliances',
        theme: 'kitchen',
        words: ['kitchen', 'mixer', 'grinder', 'chimney', 'geyser', 'water heater', 'appliance', 'fan'],
        noun: 'home appliances',
    },
    {
        category: 'Water Dispensers',
        slug: 'water-dispensers',
        theme: 'summer',
        words: ['water dispenser', 'dispenser'],
        noun: 'water dispensers',
    },
    {
        category: 'Chest Freezers',
        slug: 'chest-freezers',
        theme: 'fridge',
        words: ['chest freezer', 'deep freezer'],
        noun: 'chest freezers',
    },
];

interface FestivalRule {
    name: string;
    theme: OccasionTheme;
    words: string[];
    /** Headline used when the prompt names no offer of its own. */
    headline: string;
}

const FESTIVAL_RULES: FestivalRule[] = [
    { name: 'Diwali', theme: 'diwali', words: ['diwali', 'deepavali'], headline: 'Diwali Dhamaka' },
    { name: 'Dussehra', theme: 'dussehra', words: ['dussehra', 'dasara'], headline: 'Dussehra Dhamaka' },
    { name: 'Ganesh Chaturthi', theme: 'ganesh', words: ['ganesh', 'vinayaka'], headline: 'Ganesh Chaturthi Offers' },
    { name: 'Sankranti', theme: 'sankranti', words: ['sankranti', 'pongal'], headline: 'Sankranti Special' },
    { name: 'Ugadi', theme: 'ugadi', words: ['ugadi', 'gudi padwa'], headline: 'Ugadi Subhakankshalu' },
    { name: 'Holi', theme: 'holi', words: ['holi'], headline: 'Holi Hai!' },
    { name: 'Eid', theme: 'eid', words: ['eid', 'ramzan', 'ramadan'], headline: 'Eid Mubarak' },
    { name: 'New Year', theme: 'newyear', words: ['new year', 'nye'], headline: 'New Year, New Home' },
    { name: 'Republic Day', theme: 'tricolour', words: ['republic day'], headline: 'Republic Day Sale' },
    { name: 'Independence Day', theme: 'tricolour', words: ['independence day', 'freedom sale'], headline: 'Freedom Sale' },
];

/** Brands the shop carries, matched against the prompt. */
const BRAND_RULES: Array<{ brand: string; logo?: string; theme?: OccasionTheme }> = [
    { brand: 'TG Smart', logo: '/brands/tgsmart.png.jpeg', theme: 'tgsmart' },
    { brand: 'Crompton', logo: '/brands/crompton.png', theme: 'crompton' },
    { brand: 'Lloyd', logo: '/brands/lloyd.png' },
    { brand: 'Whirlpool', logo: '/brands/whirlpool.png' },
    { brand: 'Orient', logo: '/brands/orient.png' },
    { brand: 'Samsung', logo: '/brands/samsung.svg' },
    { brand: 'Daikin', logo: '/brands/daikin.svg' },
    { brand: 'Carrier', logo: '/brands/carrier.svg' },
    { brand: 'Bluestar', logo: '/brands/bluestar.svg' },
    { brand: 'Sansui', logo: '/brands/sansui.png' },
    { brand: 'LG', logo: '/brands/lg.png' },
    { brand: 'Voltas', logo: '/brands/voltas.svg' },
    { brand: 'Mitsubishi', logo: '/brands/mitsubishi.png' },
    { brand: 'O-General', logo: '/brands/o-general.svg' },
    { brand: 'Hitachi', logo: '/brands/hitachi.svg' },
    { brand: 'Godrej', logo: '/brands/godrej.png' },
    { brand: 'Haier', logo: '/brands/haier.png' },
];

/**
 * Whole-word match that tolerates a plural, so "ac" does not fire inside
 * "placement" but "coolers", "TVs" and "washing machines" all still land on
 * their category — which is how a shopkeeper actually types a brief.
 */
function mentions(prompt: string, word: string): boolean {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(^|[^a-z0-9])${escaped}(e?s)?($|[^a-z0-9])`, 'i').test(prompt);
}

export interface PromptReading {
    category?: CategoryRule;
    festival?: FestivalRule;
    brand?: { brand: string; logo?: string; theme?: OccasionTheme };
    /** Discount percentage named in the prompt, if any. */
    discount?: number;
    /** True when the prompt stresses a short window. */
    urgent: boolean;
}

/** Pull the facts out of a plain-English prompt. */
export function readPrompt(prompt: string): PromptReading {
    const text = prompt.toLowerCase();

    // Longest phrase first, so "air cooler" beats "ac" and "smart tv" beats "tv".
    const category = [...CATEGORY_RULES]
        .flatMap((rule) => rule.words.map((word) => ({ rule, word })))
        .sort((a, b) => b.word.length - a.word.length)
        .find(({ word }) => mentions(text, word))?.rule;

    const festival = FESTIVAL_RULES.find((rule) => rule.words.some((w) => mentions(text, w)));
    const brand = BRAND_RULES.find((rule) => mentions(text, rule.brand.toLowerCase()));

    const percent = text.match(/(\d{1,2})\s*%/);
    const flat = text.match(/(?:flat|upto|up to)\s+(\d{1,2})/);
    const discount = percent ? Number(percent[1]) : flat ? Number(flat[1]) : undefined;

    const urgent = ['today', 'tonight', 'weekend', 'this week', 'last day', 'hurry', '3 days', 'limited']
        .some((w) => mentions(text, w));

    return { category, festival, brand, discount, urgent };
}

/** `YYYY-MM-DD` `days` from `from`. */
function addDays(from: string, days: number): string {
    const [y, m, d] = from.split('-').map(Number);
    return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

/**
 * Turn a prompt into a finished design, with no AI involved.
 *
 * This is the studio's floor, not its ceiling: it runs instantly, works with
 * no API key, and is what the AI copywriter falls back to if it is unreachable
 * or returns something unusable. The copy it writes is plain but never wrong —
 * it only ever states things the shop can actually honour.
 */
export function draftFromPrompt(prompt: string, today: string): BannerDesign {
    const reading = readPrompt(prompt);
    const { category, festival, brand, discount, urgent } = reading;

    const theme: OccasionTheme =
        festival?.theme ?? brand?.theme ?? category?.theme ?? 'sale';

    const eyebrow = festival
        ? festival.name
        : brand
          ? `${brand.brand} Offer`
          : category
            ? category.category
            : 'Special Offer';

    const headline = festival
        ? festival.headline
        : brand
          ? `${brand.brand} Days`
          : category
            ? CATEGORY_HEADLINES[category.category] ?? `${category.category} Sale`
            : 'Best Prices In Secunderabad';

    const subject = category?.noun ?? (brand ? `${brand.brand} products` : 'ACs, TVs, fridges & washing machines');
    const saving = discount ? `Up to ${discount}% off ` : 'Festive prices ';
    const subline = `${saving}on ${subject} — free delivery, installation and EMI.`;

    const href = category
        ? `/category/${category.slug}`
        : brand
          ? `/search?q=${encodeURIComponent(brand.brand)}`
          : '/category/all';

    const ctaLabel = category
        ? `Shop ${category.category}`
        : brand
          ? `Shop ${brand.brand}`
          : 'View Offers';

    // A banner shouting "today only" must not still be up next week.
    const endsOn = addDays(today, urgent ? 3 : 14);

    const layout: BannerLayout = brand ? 'split' : festival ? 'poster' : discount ? 'coupon' : 'spotlight';

    return {
        id: `studio-${Date.now()}`,
        eyebrow,
        headline,
        subline,
        ctaLabel,
        href,
        theme,
        layout,
        pattern: festival ? 'rays' : 'dots',
        productCategory: category?.category ?? 'all',
        brand: brand?.brand,
        logo: brand?.logo,
        alt: buildAlt({ eyebrow, headline, subject, discount, brand: brand?.brand }),
        endsOn,
    };
}

/** Headlines worth more than "<Category> Sale". */
const CATEGORY_HEADLINES: Record<string, string> = {
    'Washing Machines': 'Laundry Day, Sorted',
    'Air Coolers': 'Cool Air, Small Bill',
    'Air Conditioners': 'Fitted Today, Cool Tonight',
    Refrigerators: 'Fresh For Longer',
    Televisions: 'Big Screen, Small Price',
    'Home Appliances': 'Kitchen Upgrade Week',
    'Water Dispensers': 'Cold Water On Tap',
    'Chest Freezers': 'Deep Freeze, Low Running Cost',
};

/**
 * Write the banner's alt text.
 *
 * A studio banner is drawn in CSS rather than uploaded as a picture, so this
 * is the only description a screen reader or a search engine ever gets. It is
 * generated rather than left to whoever is in a hurry, and stays editable.
 */
export function buildAlt(parts: {
    eyebrow: string;
    headline: string;
    subject: string;
    discount?: number;
    brand?: string;
}): string {
    const saving = parts.discount ? ` Up to ${parts.discount}% off.` : '';
    const brand = parts.brand ? ` ${parts.brand} range.` : '';
    return `${parts.eyebrow} at Raj Electronics: ${parts.headline} — offers on ${parts.subject}.${saving}${brand} Free delivery, installation and EMI. RP Road, Secunderabad.`;
}
