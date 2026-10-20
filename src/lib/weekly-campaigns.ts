import { todayInIST, type Occasion, type OccasionOverride, type OccasionTheme } from './occasions';

/**
 * RAJ ELECTRONICS: WEEKLY BANNER ROTATION
 *
 * A second banner slot, next to the festival one. Where the festival calendar
 * in src/lib/occasions.ts goes quiet for weeks at a time, this always has
 * something on air: every Monday a different campaign takes the slot, picked
 * from the pool below, and it runs until Sunday.
 *
 * It is a rotation, not a queue — the week itself decides which campaign runs
 * (see pickForWeek), so nobody has to remember to change the banner, nothing
 * expires, and the homepage never shows last month's offer. Each campaign
 * carries its own alt text, so a new banner never goes live undescribed.
 *
 * Seasonal campaigns name the months they may run in: coolers in the Hyderabad
 * summer, geysers in winter. Everything else is year-round.
 */

export interface WeeklyCampaign {
    /** Stable key — also the key an admin override is stored under. */
    id: string;
    /** Eyebrow line, e.g. "This Week · Washing Machines". */
    name: string;
    /** The big line. Short: it shares an ultra-wide strip with the products. */
    headline: string;
    /** One supporting line naming the actual offer. */
    subline: string;
    ctaLabel: string;
    href: string;
    theme: OccasionTheme;
    /** Product.category the showcase draws from. Omit for store-wide. */
    productCategory?: string;
    /** Product.brand the showcase draws from, on a brand week. */
    brand?: string;
    /** Brand mark shown above the headline. */
    logo?: string;
    /** What a screen reader announces for the banner. Always written by hand. */
    alt: string;
    /**
     * Months (1-12, Asia/Kolkata) this campaign may run in. Omit for year-round.
     * Stops the cooler banner leading the homepage in December.
     */
    months?: number[];
    /**
     * Months where this campaign is worth running more often than its turn —
     * it gets a second slot in the rotation. Cooling is the whole business in
     * an April in Hyderabad; one week in nine would waste the season.
     */
    peak?: number[];
    enabled?: boolean;
}

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/** 5 Jan 1970 — the first Monday of the epoch, so week indices start on a Monday. */
const EPOCH_MONDAY = Date.UTC(1970, 0, 5);

/* ─────────────────────────── The pool ─────────────────────────── */

const CAMPAIGNS: WeeklyCampaign[] = [
    {
        id: 'week-washing-machines',
        name: 'This Week · Washing Machines',
        headline: 'Laundry Day, Sorted',
        subline: 'Front load, top load & semi-automatic — free installation and old-machine exchange.',
        ctaLabel: 'Shop Washing Machines',
        href: '/category/washing-machines',
        theme: 'washer',
        productCategory: 'Washing Machines',
        alt: "This week's offer at Raj Electronics: washing machines — front load, top load and semi-automatic models from Whirlpool, LG, Samsung and Godrej, with free installation, old-machine exchange and EMI. Secunderabad.",
    },
    {
        id: 'week-air-coolers',
        name: 'This Week · Air Coolers',
        headline: 'Cool Air, Small Bill',
        subline: 'Desert, tower & personal coolers in stock — delivered the same day.',
        ctaLabel: 'Shop Air Coolers',
        href: '/category/air-coolers',
        theme: 'cooler',
        productCategory: 'Air Coolers',
        // Hyderabad cooler season: a cooler banner in December sells nothing.
        months: [2, 3, 4, 5, 6],
        peak: [4, 5],
        alt: "This week's offer at Raj Electronics: air coolers — desert, tower and personal coolers from Crompton, Orient and Voltas, in stock with same-day delivery in Secunderabad and Hyderabad.",
    },
    {
        id: 'week-tg-smart',
        name: 'Brand Week · TG Smart',
        headline: 'TG Smart, Priced Smarter',
        subline: 'The full TG Smart range — smart TVs, ACs and home appliances at dealer prices.',
        ctaLabel: 'Shop TG Smart',
        href: '/search?q=TG%20Smart',
        theme: 'tgsmart',
        brand: 'TG Smart',
        logo: '/brands/tgsmart.png.jpeg',
        alt: 'TG Smart brand week at Raj Electronics: smart TVs, air conditioners and home appliances from TG Smart at authorised dealer prices, with warranty, free delivery and EMI. RP Road, Secunderabad.',
    },
    {
        id: 'week-crompton',
        name: 'Brand Week · Crompton',
        headline: 'Crompton, Built To Last',
        subline: 'Fans, coolers, geysers & pumps — the full Crompton range, on display in store.',
        ctaLabel: 'Shop Crompton',
        href: '/search?q=Crompton',
        theme: 'crompton',
        brand: 'Crompton',
        logo: '/brands/crompton.png',
        alt: 'Crompton brand week at Raj Electronics: Crompton ceiling fans, air coolers, water heaters and pumps at authorised dealer prices, with warranty and free delivery in Secunderabad.',
    },
    {
        id: 'week-refrigerators',
        name: 'This Week · Refrigerators',
        headline: 'Fresh For Longer',
        subline: 'Single door to side-by-side — free delivery and installation across Secunderabad.',
        ctaLabel: 'Shop Refrigerators',
        href: '/category/refrigerators',
        theme: 'fridge',
        productCategory: 'Refrigerators',
        alt: "This week's offer at Raj Electronics: refrigerators — single door, double door and side-by-side models from Samsung, LG, Whirlpool, Godrej and Haier, with free delivery and installation in Secunderabad.",
    },
    {
        id: 'week-televisions',
        name: 'This Week · Smart TVs',
        headline: 'Big Screen, Small Price',
        subline: '4K, OLED and Google TV — see every model running live on our wall.',
        ctaLabel: 'Shop Smart TVs',
        href: '/category/televisions',
        theme: 'tv',
        productCategory: 'Televisions',
        alt: "This week's offer at Raj Electronics: smart televisions — 4K, OLED and Google TV models from Samsung, LG, Sansui and TG Smart, all on live display with wall mounting included. Secunderabad.",
    },
    {
        id: 'week-air-conditioners',
        name: 'This Week · Air Conditioners',
        headline: 'Fitted Today, Cool Tonight',
        subline: 'Split, window & inverter ACs — same-day installation by our own fitters.',
        ctaLabel: 'Shop Air Conditioners',
        href: '/category/air-conditioners',
        theme: 'summer',
        productCategory: 'Air Conditioners',
        months: [2, 3, 4, 5, 6, 7],
        peak: [3, 4, 5, 6],
        alt: "This week's offer at Raj Electronics: air conditioners — split, window and inverter ACs from Daikin, Lloyd, Voltas, Bluestar and Hitachi, with same-day installation in Secunderabad and Hyderabad.",
    },
    {
        id: 'week-kitchen',
        name: 'This Week · Kitchen & Home',
        headline: 'Kitchen Upgrade Week',
        subline: 'Mixers, chimneys, geysers & small appliances at dealer prices.',
        ctaLabel: 'Shop Home Appliances',
        href: '/category/home-appliances',
        theme: 'kitchen',
        productCategory: 'Home Appliances',
        alt: "This week's offer at Raj Electronics: kitchen and home appliances — mixer grinders, chimneys, water heaters and small appliances at dealer prices, with warranty and EMI. RP Road, Secunderabad.",
    },
    {
        id: 'week-exchange',
        name: 'This Week · Exchange Offer',
        headline: 'Old For New',
        subline: 'Trade in any working appliance and take the value straight off the price.',
        ctaLabel: 'See Exchange Deals',
        href: '/category/all',
        theme: 'sale',
        alt: 'Exchange offer week at Raj Electronics: trade in any working television, refrigerator, washing machine or air conditioner and take the exchange value off the price of a new one. Secunderabad.',
    },
];

/* ─────────────────────────── Week arithmetic ─────────────────────────── */

/** `YYYY-MM-DD` → a UTC-midnight Date, with no timezone shifting. */
function parseISO(iso: string): Date {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
}

function formatISO(date: Date): string {
    return date.toISOString().slice(0, 10);
}

/** The Monday of the week an ISO date falls in. Weeks run Monday → Sunday. */
export function weekStart(iso: string): string {
    const date = parseISO(iso);
    // getUTCDay() is Sunday-first; shift it so Monday is 0.
    const offset = (date.getUTCDay() + 6) % 7;
    return formatISO(new Date(date.getTime() - offset * 86400000));
}

/** The Sunday closing the week that starts on `mondayISO`. */
export function weekEnd(mondayISO: string): string {
    return formatISO(new Date(parseISO(mondayISO).getTime() + 6 * 86400000));
}

/** The same date `weeks` weeks away — negative to go back. */
function shiftWeek(iso: string, weeks: number): string {
    return formatISO(new Date(parseISO(iso).getTime() + weeks * WEEK_MS));
}

/**
 * Weeks since the epoch Monday — a number that only ever increases.
 *
 * Used instead of the ISO week number so the rotation does not repeat a
 * campaign across a year boundary (week 52 followed by week 1 would otherwise
 * land on the same slot whenever the pool size divides into 52).
 */
export function weekIndex(mondayISO: string): number {
    return Math.round((parseISO(mondayISO).getTime() - EPOCH_MONDAY) / WEEK_MS);
}

/** ISO week number, shown in the admin schedule so a week can be named. */
export function isoWeekNumber(iso: string): number {
    // Thursday rule: a week belongs to the year containing its Thursday, and
    // 4 January is always in week 1 — so counting from that week's Thursday
    // gets the year boundary right without special cases.
    const thursday = new Date(parseISO(weekStart(iso)).getTime() + 3 * 86400000);
    const jan4 = parseISO(`${thursday.getUTCFullYear()}-01-04`);
    const week1Thursday = new Date(
        jan4.getTime() + (3 - ((jan4.getUTCDay() + 6) % 7)) * 86400000
    );
    return 1 + Math.round((thursday.getTime() - week1Thursday.getTime()) / WEEK_MS);
}

/** "2026-10-19" → "Mon 19 Oct", for the admin schedule. */
export function formatWeekLabel(mondayISO: string): string {
    return new Intl.DateTimeFormat('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        timeZone: 'UTC',
    }).format(parseISO(mondayISO));
}

/* ─────────────────────────── Selection ─────────────────────────── */

/** Merge the pool with admin overrides (reworded copy, or switched off). */
export function resolveWeeklyCampaigns(overrides: OccasionOverride[] = []): WeeklyCampaign[] {
    const byId = new Map(overrides.map((o) => [o.id, o]));

    return CAMPAIGNS.map((campaign) => {
        const override = byId.get(campaign.id);
        if (!override) return campaign;

        return {
            ...campaign,
            // `??` not `||`, so an intentionally blank subline is respected.
            headline: override.headline ?? campaign.headline,
            subline: override.subline ?? campaign.subline,
            ctaLabel: override.ctaLabel ?? campaign.ctaLabel,
            href: override.href ?? campaign.href,
            enabled: override.enabled ?? true,
        };
    });
}

/**
 * The Monday the rotation is replayed from. Only the sequence after it matters,
 * so it just has to sit before the site went live and be a Monday.
 */
const ROTATION_ANCHOR = '2024-01-01';

/** A guard on the replay loop — about fifty years out, never reached in practice. */
const MAX_REPLAY_WEEKS = 2600;

/**
 * The whole rotation from the anchor week up to and including `targetMonday`,
 * as weekIndex → campaign.
 *
 * Replaying beats computing a week in isolation. Two earlier attempts did the
 * latter — week counter modulo the in-season pool, then modulo a fixed
 * playlist — and both ran the same banner two weeks together whenever a season
 * opened or closed, because a week has no way of knowing what its neighbour
 * chose. Here each week picks the eligible campaign that has gone longest
 * without a turn and records it, so "not the same as last week" is simply true
 * by construction, and so is fairness over the year.
 *
 * It stays deterministic: same anchor, same campaigns, same answer on every
 * server, render and admin preview.
 */
function rotationUpTo(
    targetMonday: string,
    live: WeeklyCampaign[]
): Map<number, WeeklyCampaign> {
    const sequence = new Map<number, WeeklyCampaign>();
    const order = new Map(live.map((c, i) => [c.id, i]));
    /** Campaign id → the week index it last ran in. */
    const lastRun = new Map<string, number>();

    let cursor = weekStart(ROTATION_ANCHOR);
    const target = weekIndex(targetMonday);

    for (let step = 0; step < MAX_REPLAY_WEEKS; step++) {
        const index = weekIndex(cursor);
        if (index > target) break;

        const month = Number(cursor.slice(5, 7));
        const inSeason = live.filter((c) => !c.months || c.months.includes(month));
        // Nothing in season would leave the top of the homepage empty, which is
        // worse than an out-of-season banner.
        const eligible = inSeason.length > 0 ? inSeason : live;

        // Never the same banner twice running — unless it is the only one left.
        const previous = sequence.get(index - 1);
        const candidates =
            eligible.length > 1 && previous
                ? eligible.filter((c) => c.id !== previous.id)
                : eligible;

        const choice = candidates.reduce((best, campaign) => {
            // A campaign never shown yet counts as having waited the longest.
            const waited = index - (lastRun.get(campaign.id) ?? index - MAX_REPLAY_WEEKS);
            // A peak-season campaign earns its turn twice as fast.
            const weight = campaign.peak?.includes(month) ? 2 : 1;
            const score = waited * weight;

            const bestWaited = index - (lastRun.get(best.id) ?? index - MAX_REPLAY_WEEKS);
            const bestScore = bestWaited * (best.peak?.includes(month) ? 2 : 1);

            // Declaration order breaks ties, so the sequence is reproducible.
            if (score > bestScore) return campaign;
            if (score < bestScore) return best;
            return (order.get(campaign.id) ?? 0) < (order.get(best.id) ?? 0) ? campaign : best;
        });

        sequence.set(index, choice);
        lastRun.set(choice.id, index);
        cursor = shiftWeek(cursor, 1);
    }

    return sequence;
}

/** The campaigns in the rotation right now — switched-off ones are out. */
function liveCampaigns(overrides: OccasionOverride[]): WeeklyCampaign[] {
    return resolveWeeklyCampaigns(overrides).filter((c) => c.enabled !== false);
}

/**
 * Which campaign runs in the week beginning `mondayISO`.
 *
 * Deterministic: the same week always resolves to the same campaign, so the
 * banner is stable across server restarts, cached renders and the admin preview.
 */
export function pickForWeek(
    mondayISO: string,
    overrides: OccasionOverride[] = []
): WeeklyCampaign | null {
    const live = liveCampaigns(overrides);
    if (live.length === 0) return null;

    return rotationUpTo(mondayISO, live).get(weekIndex(mondayISO)) ?? null;
}

/** A weekly campaign expressed as an Occasion, so it renders like any banner. */
export function toOccasion(campaign: WeeklyCampaign, mondayISO: string): Occasion {
    return {
        id: campaign.id,
        name: campaign.name,
        headline: campaign.headline,
        subline: campaign.subline,
        ctaLabel: campaign.ctaLabel,
        href: campaign.href,
        theme: campaign.theme,
        productCategory: campaign.productCategory,
        brand: campaign.brand,
        logo: campaign.logo,
        alt: campaign.alt,
        start: mondayISO,
        end: weekEnd(mondayISO),
        // Below every festival: when Diwali is on, it leads and this follows.
        priority: 5,
        enabled: campaign.enabled,
    };
}

/** The banner on air this week, ready for <OccasionBanner>. */
export function getWeeklyCampaign(
    overrides: OccasionOverride[] = [],
    today: string = todayInIST()
): Occasion | null {
    const monday = weekStart(today);
    const campaign = pickForWeek(monday, overrides);
    return campaign ? toOccasion(campaign, monday) : null;
}

export interface ScheduledWeek {
    /** Monday of the week. */
    start: string;
    end: string;
    isoWeek: number;
    label: string;
    campaign: WeeklyCampaign | null;
}

/**
 * The next few weeks of the rotation, for the admin screen — so the shop can
 * see what is coming before it goes live, not after.
 */
export function weeklySchedule(
    overrides: OccasionOverride[] = [],
    weeks = 8,
    today: string = todayInIST()
): ScheduledWeek[] {
    const firstMonday = weekStart(today);
    const live = liveCampaigns(overrides);

    // One replay covers the whole run: the sequence up to the last week it
    // asks for already contains every week before it.
    const sequence =
        live.length > 0
            ? rotationUpTo(shiftWeek(firstMonday, weeks - 1), live)
            : new Map<number, WeeklyCampaign>();

    return Array.from({ length: weeks }, (_, i) => {
        const start = shiftWeek(firstMonday, i);
        return {
            start,
            end: weekEnd(start),
            isoWeek: isoWeekNumber(start),
            label: formatWeekLabel(start),
            campaign: sequence.get(weekIndex(start)) ?? null,
        };
    });
}

/**
 * Every campaign with its state, for the admin list: whether it is on air now
 * and, if not, the Monday it next comes round.
 */
export function listWeeklyCampaigns(
    overrides: OccasionOverride[] = [],
    today: string = todayInIST()
): Array<WeeklyCampaign & { status: 'live' | 'queued' | 'off'; nextOnAir: string | null }> {
    const resolved = resolveWeeklyCampaigns(overrides);
    // A year ahead: enough for the rarest seasonal campaign to come round once.
    const horizon = weeklySchedule(overrides, 53, today);
    const liveId = horizon[0]?.campaign?.id;

    return resolved.map((campaign) => {
        const next = horizon.slice(1).find((week) => week.campaign?.id === campaign.id);

        return {
            ...campaign,
            status:
                campaign.enabled === false
                    ? ('off' as const)
                    : campaign.id === liveId
                      ? ('live' as const)
                      : ('queued' as const),
            nextOnAir: campaign.enabled === false ? null : (next?.start ?? null),
        };
    });
}
