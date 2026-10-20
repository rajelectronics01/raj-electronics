/**
 * RAJ ELECTRONICS: OCCASION BANNER CALENDAR
 *
 * Drives the auto-generated festival banners on the homepage hero. Each entry
 * describes an occasion and the window it should be on air; the artwork itself
 * is rendered in CSS by <OccasionBanner>, so nothing has to be designed or
 * uploaded for a banner to appear.
 *
 * Windows deliberately START BEFORE the festival — people buy an AC or a TV in
 * the run-up, not on the day itself — and end on the day.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  ⚠️  DATES NEED CONFIRMING EACH YEAR
 *  Fixed-date entries (Sankranti, Independence Day, seasonal campaigns) are
 *  safe. LUNAR festivals — Diwali, Dussehra, Ugadi, Holi, Eid, Ganesh Chaturthi
 *  — shift every year and the dates below are best-effort. Check them against a
 *  Telugu calendar, or just correct them in Admin → Occasions, which overrides
 *  everything here without a code change.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type OccasionTheme =
    // Festivals and seasons — driven by the calendar below.
    | 'diwali'
    | 'dussehra'
    | 'ganesh'
    | 'sankranti'
    | 'ugadi'
    | 'holi'
    | 'eid'
    | 'summer'
    | 'tricolour'
    | 'newyear'
    | 'sale'
    // Category and brand looks — these drive the weekly rotation in
    // src/lib/weekly-campaigns.ts, which runs a different banner every week
    // regardless of whether a festival is on.
    | 'washer'
    | 'cooler'
    | 'fridge'
    | 'tv'
    | 'kitchen'
    | 'tgsmart'
    | 'crompton';

export interface Occasion {
    /** Stable key — also the key used for admin overrides. */
    id: string;
    /** Shown as the small eyebrow line, e.g. "Diwali". */
    name: string;
    /** The big line. Keep it short — it has to fit an ultra-wide strip. */
    headline: string;
    /** One supporting line naming the actual offer. */
    subline: string;
    ctaLabel: string;
    href: string;
    theme: OccasionTheme;
    /**
     * Category the banner pulls its product shots from, matched against
     * Product.category. Omit (or 'all') to draw the best discounts store-wide.
     */
    productCategory?: string;
    /**
     * Brand to narrow the showcase to, matched against Product.brand. Set on a
     * brand week ("TG Smart Week"); omit on a category or festival banner.
     */
    brand?: string;
    /** Brand mark shown above the headline, e.g. '/brands/crompton.png'. */
    logo?: string;
    /**
     * Which arrangement the banner is drawn in. Omitted means 'spotlight', the
     * layout every festival banner used before the studio existed.
     * Typed loosely to keep this module free of a dependency on
     * banner-templates, which imports from here.
     */
    layout?: 'spotlight' | 'poster' | 'coupon' | 'split' | 'price';
    /** Background pattern washed behind the artwork. Omitted means none. */
    pattern?: 'none' | 'rays' | 'dots' | 'arcs' | 'grid';
    /**
     * What the banner says to a screen reader, and the accessible name of the
     * slide link wrapping it. The artwork is CSS, not an image, so there is no
     * <img alt> to carry this — see bannerAlt() for the fallback.
     */
    alt?: string;
    /** Inclusive ISO dates (Asia/Kolkata). Banner is live from start to end. */
    start: string;
    end: string;
    /** Higher wins when two occasions overlap. */
    priority?: number;
    enabled?: boolean;
}

/**
 * A product as the banner needs it — flattened and pre-costed so the component
 * stays presentational. Deliberately free of Prisma types: this module is
 * imported by client components too.
 */
export interface BannerProduct {
    id: string;
    name: string;
    slug: string;
    brand: string;
    price: number;
    originalPrice?: number | null;
    image: string;
    /** Whole-percent saving, 0 when there is no original price to compare. */
    discount: number;
}

/** Every occasion the store runs, in date order. */
const CALENDAR: Occasion[] = [
    // ─────────────── Fixed-date, repeats every year ───────────────
    {
        id: 'sankranti-2027',
        name: 'Sankranti & Pongal',
        headline: 'Sankranti Special',
        subline: 'Festive prices on TVs, washing machines & kitchen appliances.',
        ctaLabel: 'Shop Sankranti Offers',
        href: '/category/all',
        theme: 'sankranti',
        productCategory: 'Televisions',
        start: '2027-01-08',
        end: '2027-01-16',
        priority: 60,
    },
    {
        id: 'republic-2027',
        name: 'Republic Day',
        headline: 'Republic Day Sale',
        subline: 'Big savings across ACs, TVs and home appliances.',
        ctaLabel: 'View Offers',
        href: '/category/all',
        theme: 'tricolour',
        productCategory: 'all',
        start: '2027-01-20',
        end: '2027-01-26',
        priority: 50,
    },
    {
        id: 'summer-2027',
        name: 'Summer Season',
        headline: 'Beat The Heat',
        subline: 'Split ACs, tower & desert coolers — lowest prices in Secunderabad.',
        ctaLabel: 'Shop Cooling',
        href: '/category/air-conditioners',
        theme: 'summer',
        productCategory: 'Air Conditioners',
        start: '2027-03-01',
        end: '2027-06-15',
        // Lowest priority: it runs for months, so any real festival outranks it.
        priority: 10,
    },
    {
        id: 'independence-2027',
        name: 'Independence Day',
        headline: 'Freedom Sale',
        subline: 'Independence Day deals on every category. EMI available.',
        ctaLabel: 'View Offers',
        href: '/category/all',
        theme: 'tricolour',
        productCategory: 'all',
        start: '2027-08-09',
        end: '2027-08-15',
        priority: 50,
    },

    // ─────────────── Lunar festivals — VERIFY ANNUALLY ───────────────
    {
        id: 'dussehra-2026',
        name: 'Dussehra',
        headline: 'Dussehra Dhamaka',
        subline: 'Auspicious-day offers on ACs, TVs & refrigerators.',
        ctaLabel: 'Shop Dussehra Offers',
        href: '/category/all',
        theme: 'dussehra',
        productCategory: 'all',
        start: '2026-10-11',
        end: '2026-10-20',
        priority: 70,
    },
    {
        id: 'diwali-2026',
        name: 'Diwali',
        headline: 'Diwali Dhamaka',
        subline: 'Our biggest sale of the year — ACs, TVs, fridges & washing machines.',
        ctaLabel: 'Shop Diwali Offers',
        href: '/category/all',
        theme: 'diwali',
        productCategory: 'all',
        start: '2026-10-26',
        end: '2026-11-09',
        priority: 100,
    },
    {
        id: 'newyear-2027',
        name: 'New Year',
        headline: 'New Year, New Home',
        subline: 'Close out the year with our best prices on home appliances.',
        ctaLabel: 'Shop New Year Deals',
        href: '/category/all',
        theme: 'newyear',
        productCategory: 'Televisions',
        start: '2026-12-24',
        end: '2027-01-02',
        priority: 55,
    },
    {
        id: 'holi-2027',
        name: 'Holi',
        headline: 'Holi Hai!',
        subline: 'Colourful savings on TVs, soundbars & home entertainment.',
        ctaLabel: 'Shop Holi Offers',
        href: '/category/televisions',
        theme: 'holi',
        productCategory: 'Televisions',
        start: '2027-03-17',
        end: '2027-03-23',
        priority: 60,
    },
    {
        id: 'ugadi-2027',
        name: 'Ugadi',
        headline: 'Ugadi Subhakankshalu',
        subline: 'Start the new year with a new AC, TV or refrigerator.',
        ctaLabel: 'Shop Ugadi Offers',
        href: '/category/all',
        theme: 'ugadi',
        productCategory: 'all',
        start: '2027-03-30',
        end: '2027-04-07',
        priority: 80,
    },
    {
        id: 'ganesh-2027',
        name: 'Ganesh Chaturthi',
        headline: 'Ganesh Chaturthi Offers',
        subline: 'Festive deals across every category. Free installation.',
        ctaLabel: 'View Offers',
        href: '/category/all',
        theme: 'ganesh',
        productCategory: 'all',
        start: '2027-08-28',
        end: '2027-09-04',
        priority: 70,
    },
];

/** Admin overrides stored under StoreSetting key `occasions`. */
export interface OccasionOverride {
    id: string;
    enabled?: boolean;
    headline?: string;
    subline?: string;
    ctaLabel?: string;
    href?: string;
    start?: string;
    end?: string;
}

/**
 * Today's date in Asia/Kolkata as `YYYY-MM-DD`.
 *
 * The server runs in UTC, so without this a Diwali banner would flip over at
 * 5:30am IST. `en-CA` formats as ISO, which also means plain string comparison
 * is a correct date comparison.
 */
export function todayInIST(now: Date = new Date()): string {
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(now);
}

/** Merge the built-in calendar with any admin overrides. */
export function resolveOccasions(overrides: OccasionOverride[] = []): Occasion[] {
    const byId = new Map(overrides.map((o) => [o.id, o]));

    return CALENDAR.map((occasion) => {
        const override = byId.get(occasion.id);
        if (!override) return occasion;

        return {
            ...occasion,
            // `?? ` not `|| ` so an intentionally blank subline is respected,
            // but an absent override key falls through to the default.
            headline: override.headline ?? occasion.headline,
            subline: override.subline ?? occasion.subline,
            ctaLabel: override.ctaLabel ?? occasion.ctaLabel,
            href: override.href ?? occasion.href,
            start: override.start ?? occasion.start,
            end: override.end ?? occasion.end,
            enabled: override.enabled ?? true,
        };
    });
}

/**
 * The occasion that should be on air right now, or null.
 * When windows overlap (Diwali landing inside the summer campaign, say) the
 * higher `priority` wins.
 */
export function getActiveOccasion(
    overrides: OccasionOverride[] = [],
    today: string = todayInIST()
): Occasion | null {
    const live = resolveOccasions(overrides)
        .filter((o) => o.enabled !== false && o.start <= today && today <= o.end)
        .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

    return live[0] ?? null;
}

/** Upcoming and current occasions, for the admin screen. */
export function listOccasions(
    overrides: OccasionOverride[] = [],
    today: string = todayInIST()
): Array<Occasion & { status: 'live' | 'upcoming' | 'past' }> {
    return resolveOccasions(overrides)
        .map((o) => ({
            ...o,
            status:
                o.start <= today && today <= o.end
                    ? ('live' as const)
                    : today < o.start
                      ? ('upcoming' as const)
                      : ('past' as const),
        }))
        .sort((a, b) => a.start.localeCompare(b.start));
}

/** The shape both the Prisma row and the /api/products JSON already satisfy. */
interface ProductLike {
    id: string;
    name: string;
    slug: string;
    brand: string;
    category: string;
    price: number;
    originalPrice?: number | null;
    images?: string[] | null;
    inStock?: boolean;
}

/** How a banner narrows the catalogue down to the products it shows. */
export interface BannerFilter {
    /** Product.category to match, e.g. 'Washing Machines'. 'all' means store-wide. */
    category?: string;
    /** Product.brand to match, e.g. 'Crompton'. */
    brand?: string;
}

/**
 * Choose which products a banner shows, ranked by how big the saving is —
 * a banner earns its place by showing a real deal, not a random item.
 *
 * Shared so the homepage and the admin preview pick identically; the discount
 * is derived from two columns, so it has to be ranked here rather than in SQL.
 *
 * A filter that matches nothing deliberately returns nothing rather than
 * falling back to the whole catalogue: a Crompton banner showing Samsung
 * stock would be worse than one showing no products at all.
 */
export function pickBannerProducts(
    rows: ProductLike[],
    filter: BannerFilter = {},
    limit = 3
): BannerProduct[] {
    const { category, brand } = filter;
    const scoped = category && category.toLowerCase() !== 'all';
    const wanted = category?.toLowerCase();
    const wantedBrand = brand?.toLowerCase();

    return rows
        .filter((p) => p.inStock !== false)
        .filter((p) => !scoped || p.category?.toLowerCase() === wanted)
        .filter((p) => !wantedBrand || p.brand?.toLowerCase() === wantedBrand)
        .filter((p) => (p.images?.length ?? 0) > 0)
        .map((p) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            brand: p.brand,
            price: p.price,
            originalPrice: p.originalPrice,
            image: p.images![0],
            discount:
                p.originalPrice && p.originalPrice > p.price
                    ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
                    : 0,
        }))
        .sort((a, b) => b.discount - a.discount || b.price - a.price)
        .slice(0, limit);
}

/**
 * What the banner says to a screen reader, and to a crawler reading the link.
 *
 * Needed because the artwork is drawn in CSS rather than uploaded as a JPEG:
 * there is no <img alt> to carry it. An occasion can spell it out in `alt`;
 * otherwise this assembles one from the copy and the live discount, so a
 * banner can never go out with a missing or stale description.
 */
export function bannerAlt(occasion: Occasion, products: BannerProduct[] = []): string {
    if (occasion.alt) return occasion.alt;

    const topDiscount = products.reduce((max, p) => Math.max(max, p.discount), 0);
    const saving = topDiscount > 0 ? ` Up to ${topDiscount}% off.` : '';
    const offer = occasion.subline ? ` ${occasion.subline}` : '';

    return `${occasion.name}: ${occasion.headline}.${offer}${saving} Raj Electronics, RP Road, Secunderabad.`;
}
