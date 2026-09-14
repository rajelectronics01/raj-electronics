"use client";

import { useState, useEffect, useMemo } from 'react';
import Button from '@/components/ui/Button';
import OccasionBanner from '@/components/home/OccasionBanner';
import {
    listOccasions,
    resolveOccasions,
    pickBannerProducts,
    type Occasion,
    type OccasionOverride,
} from '@/lib/occasions';
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

/** Fields an admin can override. */
const EDITABLE = ['headline', 'subline', 'ctaLabel', 'href', 'start', 'end'] as const;
type EditableField = (typeof EDITABLE)[number];

export default function OccasionsAdminTab() {
    const [items, setItems] = useState<Array<Occasion & { status: string }>>([]);
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

    useEffect(() => {
        fetch('/api/admin/settings?key=occasions')
            .then((res) => res.json())
            .then((data) => {
                const overrides: OccasionOverride[] = Array.isArray(data?.data) ? data.data : [];
                setItems(listOccasions(overrides));
            })
            .catch((err) => {
                console.error(err);
                setItems(listOccasions([]));
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
                              ? `Saved — ${overrides.length} occasion${overrides.length === 1 ? '' : 's'} customised.`
                              : 'Saved — all occasions back on their calendar defaults.',
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
                                products={pickBannerProducts(catalogue, item.productCategory, 3)}
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
