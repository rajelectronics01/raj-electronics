"use client";

import { useState, useEffect, useMemo } from 'react';
import Button from '@/components/ui/Button';
import OccasionBanner from '@/components/home/OccasionBanner';
import {
    listOccasions,
    resolveOccasions,
    pickBannerProducts,
    todayInIST,
    type Occasion,
    type OccasionOverride,
} from '@/lib/occasions';
import {
    listWeeklyCampaigns,
    resolveWeeklyCampaigns,
    weeklySchedule,
    weekStart,
    toOccasion,
    formatWeekLabel,
    type WeeklyCampaign,
} from '@/lib/weekly-campaigns';
import styles from './OccasionsAdminTab.module.css';

/**
 * RAJ ELECTRONICS: OCCASION BANNERS
 *
 * Festival banners generate themselves from the calendar in src/lib/occasions.ts
 * and go live on their own dates — this screen exists to preview them, reword
 * the offer, correct a lunar date, or switch one off.
 *
 * Only fields that actually differ from the built-in calendar are saved, so
 * future updates to the calendar in code still reach occasions left untouched.
 */

/** Fields an admin can override on a festival. */
const EDITABLE = ['headline', 'subline', 'ctaLabel', 'href', 'start', 'end'] as const;
type EditableField = (typeof EDITABLE)[number];

/**
 * The same, for a weekly campaign — minus the dates, which belong to the
 * rotation: a weekly banner runs Monday to Sunday and then hands over.
 */
const WEEKLY_EDITABLE = ['headline', 'subline', 'ctaLabel', 'href'] as const;
type WeeklyField = (typeof WEEKLY_EDITABLE)[number];

type WeeklyItem = WeeklyCampaign & { status: 'live' | 'queued' | 'off'; nextOnAir: string | null };

export default function OccasionsAdminTab() {
    const [items, setItems] = useState<Array<Occasion & { status: string }>>([]);
    const [weekly, setWeekly] = useState<WeeklyItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
    /** Catalogue, so each preview shows the same real deals the homepage would. */
    const [catalogue, setCatalogue] = useState<any[]>([]);

    /** The untouched calendar, to diff against when saving. */
    const defaults = useMemo(() => {
        const map = new Map<string, Occasion>();
        resolveOccasions([]).forEach((o) => map.set(o.id, o));
        return map;
    }, []);

    /** The untouched weekly pool, likewise. */
    const weeklyDefaults = useMemo(() => {
        const map = new Map<string, WeeklyCampaign>();
        resolveWeeklyCampaigns([]).forEach((c) => map.set(c.id, c));
        return map;
    }, []);

    /** Monday of the current week — what "on air now" means for a weekly banner. */
    const thisMonday = useMemo(() => weekStart(todayInIST()), []);

    /**
     * The next two months of the rotation, recomputed from what is on screen —
     * so switching a campaign off immediately shows what takes its place.
     */
    const schedule = useMemo(
        () =>
            weeklySchedule(
                weekly.map((w) => ({ id: w.id, enabled: w.enabled !== false })),
                8
            ),
        [weekly]
    );

    useEffect(() => {
        fetch('/api/admin/settings?key=occasions')
            .then((res) => res.json())
            .then((data) => {
                const overrides: OccasionOverride[] = Array.isArray(data?.data) ? data.data : [];
                setItems(listOccasions(overrides));
                setWeekly(listWeeklyCampaigns(overrides));
            })
            .catch((err) => {
                console.error(err);
                setItems(listOccasions([]));
                setWeekly(listWeeklyCampaigns([]));
            })
            .finally(() => setLoading(false));

        fetch('/api/products')
            .then((res) => res.json())
            .then((rows) => setCatalogue(Array.isArray(rows) ? rows : []))
            .catch(() => setCatalogue([]));
    }, []);

    const update = (id: string, field: EditableField | 'enabled', value: string | boolean) => {
        setItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
        );
        setMessage(null);
    };

    const resetOne = (id: string) => {
        const original = defaults.get(id);
        if (!original) return;
        setItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, ...original, status: item.status } : item))
        );
        setMessage(null);
    };

    const updateWeekly = (id: string, field: WeeklyField | 'enabled', value: string | boolean) => {
        setWeekly((prev) =>
            prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
        );
        setMessage(null);
    };

    const resetWeekly = (id: string) => {
        const original = weeklyDefaults.get(id);
        if (!original) return;
        setWeekly((prev) =>
            prev.map((item) =>
                item.id === id
                    ? { ...item, ...original, status: item.status, nextOnAir: item.nextOnAir }
                    : item
            )
        );
        setMessage(null);
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);

        // Persist only genuine differences — an occasion left alone stays bound
        // to the calendar in code and picks up any future correction there.
        const overrides: OccasionOverride[] = [];

        for (const item of items) {
            const original = defaults.get(item.id);
            if (!original) continue;

            const diff: OccasionOverride = { id: item.id };
            let changed = false;

            for (const field of EDITABLE) {
                if (item[field] !== original[field]) {
                    diff[field] = item[field];
                    changed = true;
                }
            }

            if (item.enabled === false) {
                diff.enabled = false;
                changed = true;
            }

            if (changed) overrides.push(diff);
        }

        // Weekly campaigns share the same store setting, keyed by campaign id —
        // the rotation looks its copy up there before it goes on air.
        for (const item of weekly) {
            const original = weeklyDefaults.get(item.id);
            if (!original) continue;

            const diff: OccasionOverride = { id: item.id };
            let changed = false;

            for (const field of WEEKLY_EDITABLE) {
                if (item[field] !== original[field]) {
                    diff[field] = item[field];
                    changed = true;
                }
            }

            if (item.enabled === false) {
                diff.enabled = false;
                changed = true;
            }

            if (changed) overrides.push(diff);
        }

        try {
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: 'occasions', value: overrides }),
            });

            setMessage(
                res.ok
                    ? {
                          ok: true,
                          text: overrides.length
                              ? `Saved — ${overrides.length} banner${overrides.length === 1 ? '' : 's'} customised.`
                              : 'Saved — every banner back on its built-in defaults.',
                      }
                    : { ok: false, text: 'Could not save. Please try again.' }
            );
        } catch {
            setMessage({ ok: false, text: 'Could not save. Please check your connection.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Loading occasions…</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h2 className={styles.title}>Occasion Banners</h2>
                    <p className={styles.lede}>
                        These banners design themselves and appear at the top of the homepage
                        on their own dates — nothing to upload. Edit the wording here, or
                        switch one off if you would rather not run it.
                    </p>
                </div>
                <div className={styles.actions}>
                    {message && (
                        <span className={`${styles.status} ${message.ok ? styles.statusOk : styles.statusErr}`}>
                            {message.text}
                        </span>
                    )}
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? 'Saving…' : 'Save Changes'}
                    </Button>
                </div>
            </div>

            {/* ── Weekly rotation ── */}
            <div className={styles.blockHead}>
                <h3 className={styles.blockTitle}>Weekly Banners</h3>
                <p className={styles.blockLede}>
                    A different banner every week, for ever — it changes by itself every
                    Monday and runs until Sunday, so the homepage is never more than a week
                    old. Seasonal ones only come round in their season (coolers in summer,
                    not December). Reword any of them here, or switch one off and the next
                    in line takes its week.
                </p>
            </div>

            <div className={styles.schedule}>
                {schedule.map((week) => (
                    <div
                        key={week.start}
                        className={styles.scheduleItem}
                        data-now={week.start === thisMonday ? 'true' : 'false'}
                    >
                        <span className={styles.scheduleWeek}>
                            {week.start === thisMonday
                                ? 'This week'
                                : `${formatWeekLabel(week.start)} · wk ${week.isoWeek}`}
                        </span>
                        <span className={styles.scheduleName}>
                            {week.campaign ? week.campaign.name : 'Nothing scheduled'}
                        </span>
                    </div>
                ))}
            </div>

            <div className={styles.list}>
                {weekly.map((item) => {
                    // Preview it in the week it will actually run, so the dates on
                    // the banner are the ones a customer will see.
                    const onAir = item.status === 'live' ? thisMonday : (item.nextOnAir ?? thisMonday);

                    return (
                        <div
                            key={item.id}
                            className={styles.card}
                            data-status={item.status === 'live' ? 'live' : 'upcoming'}
                            data-off={item.enabled === false ? 'true' : 'false'}
                        >
                            <div className={styles.cardHead}>
                                <h4 className={styles.cardName}>
                                    {item.name}
                                    <span
                                        className={styles.badge}
                                        data-status={
                                            item.status === 'live'
                                                ? 'live'
                                                : item.status === 'off'
                                                  ? 'past'
                                                  : 'upcoming'
                                        }
                                    >
                                        {item.status === 'live'
                                            ? 'On air now'
                                            : item.status === 'off'
                                              ? 'Switched off'
                                              : item.nextOnAir
                                                ? `Next: ${formatWeekLabel(item.nextOnAir)}`
                                                : 'Not in rotation'}
                                    </span>
                                </h4>
                                <label className={styles.toggle}>
                                    <input
                                        type="checkbox"
                                        checked={item.enabled !== false}
                                        onChange={(e) => updateWeekly(item.id, 'enabled', e.target.checked)}
                                    />
                                    {item.enabled === false ? 'Switched off' : 'In rotation'}
                                </label>
                            </div>

                            <div className={styles.preview}>
                                <OccasionBanner
                                    occasion={toOccasion(item, onAir)}
                                    products={pickBannerProducts(
                                        catalogue,
                                        { category: item.productCategory, brand: item.brand },
                                        3
                                    )}
                                />
                            </div>

                            <div className={styles.body}>
                                <div className={`${styles.field} ${styles.fieldWide}`}>
                                    <label className={styles.label}>Headline</label>
                                    <input
                                        className={styles.input}
                                        value={item.headline}
                                        onChange={(e) => updateWeekly(item.id, 'headline', e.target.value)}
                                    />
                                </div>

                                <div className={`${styles.field} ${styles.fieldWide}`}>
                                    <label className={styles.label}>Offer line</label>
                                    <input
                                        className={styles.input}
                                        value={item.subline}
                                        onChange={(e) => updateWeekly(item.id, 'subline', e.target.value)}
                                    />
                                </div>

                                <div className={styles.field}>
                                    <label className={styles.label}>Button text</label>
                                    <input
                                        className={styles.input}
                                        value={item.ctaLabel}
                                        onChange={(e) => updateWeekly(item.id, 'ctaLabel', e.target.value)}
                                    />
                                </div>

                                <div className={styles.field}>
                                    <label className={styles.label}>Button link</label>
                                    <input
                                        className={styles.input}
                                        value={item.href}
                                        onChange={(e) => updateWeekly(item.id, 'href', e.target.value)}
                                    />
                                </div>

                                {/* The banner is drawn, not photographed, so this is what a
                                    blind customer hears and what Google reads. */}
                                <div className={styles.fieldWide}>
                                    <p className={styles.alt}>
                                        <strong>Alt text</strong>
                                        {item.alt}
                                    </p>
                                </div>

                                <div className={styles.fieldWide}>
                                    <button className={styles.reset} onClick={() => resetWeekly(item.id)}>
                                        Reset this banner to its defaults
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ── Festival calendar ── */}
            <div className={styles.blockHead}>
                <h3 className={styles.blockTitle}>Festival Banners</h3>
                <p className={styles.blockLede}>
                    These run on their own festival dates and lead the homepage ahead of
                    the weekly banner while they are on.
                </p>
            </div>

            <div className={styles.note}>
                <span aria-hidden="true">⚠️</span>
                <span>
                    <strong>Please check the festival dates.</strong> Fixed dates (Sankranti,
                    Independence Day, the summer season) are reliable, but Diwali, Dussehra,
                    Ugadi, Holi and Ganesh Chaturthi move every year. Correct any date below
                    and it will override the built-in calendar.
                </span>
            </div>

            <div className={styles.list}>
                {items.map((item) => (
                    <div
                        key={item.id}
                        className={styles.card}
                        data-status={item.status}
                        data-off={item.enabled === false ? 'true' : 'false'}
                    >
                        <div className={styles.cardHead}>
                            <h4 className={styles.cardName}>
                                {item.name}
                                <span className={styles.badge} data-status={item.status}>
                                    {item.status === 'live'
                                        ? 'On air now'
                                        : item.status === 'upcoming'
                                          ? 'Upcoming'
                                          : 'Finished'}
                                </span>
                            </h4>
                            <label className={styles.toggle}>
                                <input
                                    type="checkbox"
                                    checked={item.enabled !== false}
                                    onChange={(e) => update(item.id, 'enabled', e.target.checked)}
                                />
                                {item.enabled === false ? 'Switched off' : 'Active'}
                            </label>
                        </div>

                        {/* Exactly what the homepage will show. */}
                        <div className={styles.preview}>
                            <OccasionBanner
                                occasion={item}
                                products={pickBannerProducts(
                                    catalogue,
                                    { category: item.productCategory, brand: item.brand },
                                    3
                                )}
                            />
                        </div>

                        <div className={styles.body}>
                            <div className={`${styles.field} ${styles.fieldWide}`}>
                                <label className={styles.label}>Headline</label>
                                <input
                                    className={styles.input}
                                    value={item.headline}
                                    onChange={(e) => update(item.id, 'headline', e.target.value)}
                                />
                            </div>

                            <div className={`${styles.field} ${styles.fieldWide}`}>
                                <label className={styles.label}>Offer line</label>
                                <input
                                    className={styles.input}
                                    value={item.subline}
                                    onChange={(e) => update(item.id, 'subline', e.target.value)}
                                    placeholder="Up to 40% off on ACs, TVs and refrigerators"
                                />
                            </div>

                            <div className={styles.field}>
                                <label className={styles.label}>Button text</label>
                                <input
                                    className={styles.input}
                                    value={item.ctaLabel}
                                    onChange={(e) => update(item.id, 'ctaLabel', e.target.value)}
                                />
                            </div>

                            <div className={styles.field}>
                                <label className={styles.label}>Button link</label>
                                <input
                                    className={styles.input}
                                    value={item.href}
                                    onChange={(e) => update(item.id, 'href', e.target.value)}
                                    placeholder="/category/air-conditioners"
                                />
                            </div>

                            <div className={styles.field}>
                                <label className={styles.label}>Starts showing</label>
                                <input
                                    type="date"
                                    className={styles.input}
                                    value={item.start}
                                    onChange={(e) => update(item.id, 'start', e.target.value)}
                                />
                            </div>

                            <div className={styles.field}>
                                <label className={styles.label}>Last day</label>
                                <input
                                    type="date"
                                    className={styles.input}
                                    value={item.end}
                                    onChange={(e) => update(item.id, 'end', e.target.value)}
                                />
                            </div>

                            <div className={styles.fieldWide}>
                                <button className={styles.reset} onClick={() => resetOne(item.id)}>
                                    Reset this occasion to its defaults
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
