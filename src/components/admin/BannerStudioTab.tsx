"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Button from '@/components/ui/Button';
import { pickBannerProducts, todayInIST } from '@/lib/occasions';
import {
    LAYOUTS,
    PALETTES,
    PATTERNS,
    type BannerDesign,
    type BannerLayout,
    type BannerPattern,
} from '@/lib/banner-templates';
import type { OccasionTheme } from '@/lib/occasions';
import type { Product } from '@/types';
import { BRANDS } from '@/types';
import styles from './BannerStudioTab.module.css';
// The swatches borrow the banner's own class so each one carries that theme's
// real colours — a second copy of the palette here would drift from it.
import bannerStyles from '@/components/home/OccasionBanner.module.css';

/**
 * RAJ ELECTRONICS: BANNER STUDIO
 *
 * Describe the banner in a sentence, get a finished one. The copy is written
 * for you, the artwork is drawn in code, and the prices come live out of the
 * catalogue — so a banner made here cannot advertise an offer that has already
 * ended, which is the usual fate of a hand-made JPEG left up too long.
 *
 * The preview is the real homepage component at the real aspect ratios, not a
 * mock-up: what is on this screen is what customers get.
 *
 * Every banner is kept on a shelf (the banner library) that nothing ever ages
 * out of. When a sale week finishes the banner comes off the homepage, but the
 * design stays here — so next Diwali is a matter of opening last Diwali's
 * banner, changing the dates and the percentage, and putting it back up.
 */

/** Briefs that show what the box expects, in the shop's own words. */
const EXAMPLES = [
    'washing machine sale, 40% off, this weekend',
    'Crompton fans and coolers, brand week',
    'Diwali offer on smart TVs',
    'exchange your old fridge, extra value this month',
    'TG Smart ACs, lowest price in Secunderabad',
];

/** How many products the banner's strip holds. */
const STRIP_SIZE = 3;

/**
 * The previews are iframes at real device widths, not scaled-down copies.
 *
 * The banner sets its type in `vw` and switches to its phone layout at 768px,
 * and both read the viewport — so a preview squeezed into a box in this page
 * would show the wrong type size, and would show the desktop layout where the
 * phone one belongs. An iframe brings its own viewport, and CSS scales the
 * finished frame down to fit. The heights are the hero's own ratios at those
 * widths: 1920×500 and 1125×825.
 */
const DESKTOP_FRAME = { width: 1440, height: 375 };
const PHONE_FRAME = { width: 390, height: 286 };

/** `YYYY-MM-DD`, `days` from today in the shop's own timezone. */
function isoInDays(days: number): string {
    const [y, m, d] = todayInIST().split('-').map(Number);
    return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

/** "2026-10-20" → "20 Oct 2026", for the shelf. */
function readableDate(iso: string): string {
    const [y, m, d] = (iso ?? '').split('-').map(Number);
    if (!y || !m || !d) return '—';
    return new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'Asia/Kolkata',
    }).format(new Date(Date.UTC(y, m - 1, d)));
}

const formatPrice = (value: number) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(value);

/** How long an offer should run, as a shopkeeper would say it. */
const RUN_LENGTHS: Array<{ label: string; days: number }> = [
    { label: 'This weekend', days: 3 },
    { label: 'One week', days: 7 },
    { label: 'Two weeks', days: 14 },
    { label: 'One month', days: 30 },
];

/**
 * Shrink a fixed-width preview frame to whatever width it is given.
 *
 * Measured rather than done in CSS: the frame has to keep its real pixel width
 * for its own viewport to mean anything, so the scale factor depends on the
 * box's measured width, which CSS cannot divide by on its own.
 */
function useFitScale(frameWidth: number) {
    const [scale, setScale] = useState(0);
    const observer = useRef<ResizeObserver | null>(null);

    // A callback ref, not a ref plus an effect: the preview box only enters the
    // page once a banner has been designed, which is after this component has
    // mounted — an effect would have measured a box that was not there yet and
    // never run again, leaving the frame scaled to nothing.
    const box = useCallback(
        (node: HTMLDivElement | null) => {
            observer.current?.disconnect();
            if (!node) return;

            const fit = () => setScale(node.clientWidth / frameWidth);
            fit();

            observer.current = new ResizeObserver(fit);
            observer.current.observe(node);
        },
        [frameWidth]
    );

    return { box, scale };
}

export default function BannerStudioTab() {
    const [prompt, setPrompt] = useState('');
    const [design, setDesign] = useState<BannerDesign | null>(null);
    const [source, setSource] = useState<'ai' | 'rules' | null>(null);
    const [generating, setGenerating] = useState(false);
    const [saving, setSaving] = useState(false);
    const [publishing, setPublishing] = useState(false);
    const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
    const [catalogue, setCatalogue] = useState<Product[]>([]);

    /** Every banner the shop has designed. Nothing in here expires. */
    const [library, setLibrary] = useState<BannerDesign[]>([]);
    /** The hero slider as saved, so the studio knows what is already live. */
    const [heroSlides, setHeroSlides] = useState<any[]>([]);
    /** Ids waiting on a second click before being deleted for good. */
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
    const [productSearch, setProductSearch] = useState('');

    const today = todayInIST();
    const editor = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        fetch('/api/products')
            .then((res) => res.json())
            .then((rows) => setCatalogue(Array.isArray(rows) ? rows : []))
            .catch(() => setCatalogue([]));

        fetch('/api/admin/banner-library')
            .then((res) => res.json())
            .then((data) => setLibrary(Array.isArray(data?.banners) ? data.banners : []))
            .catch(() => setLibrary([]));

        loadHero();
    }, []);

    /** The saved slider, read fresh — it is also edited from the Hero tab. */
    const loadHero = async () => {
        try {
            const data = await fetch('/api/admin/settings?key=hero').then((r) => r.json());
            const slides = Array.isArray(data?.data) ? data.data : [];
            setHeroSlides(slides);
            return slides;
        } catch {
            return [];
        }
    };

    /** Which hand-picked products this design carries, if any. */
    const picks = useMemo(() => design?.productIds ?? [], [design]);
    const handPicked = picks.length > 0;

    /** The same products the homepage would put in this banner. */
    const products = useMemo(
        () =>
            design
                ? pickBannerProducts(
                      catalogue,
                      {
                          category: design.productCategory,
                          brand: design.brand,
                          productIds: design.productIds,
                      },
                      STRIP_SIZE
                  )
                : [],
        [catalogue, design]
    );

    /** Is this design already on the shelf, and is it already on the homepage? */
    const isSaved = Boolean(design && library.some((b) => b.id === design.id));
    const liveSlideIndex = design
        ? heroSlides.findIndex((slide: any) => slide?.design?.id === design.id)
        : -1;
    const isLive = liveSlideIndex > -1;
    const expired = Boolean(design?.endsOn && design.endsOn < today);

    const generate = async (brief: string) => {
        const text = brief.trim();
        if (!text) return;

        setGenerating(true);
        setMessage(null);

        try {
            const res = await fetch('/api/admin/banner-studio', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: text }),
            });
            const data = await res.json();

            if (!res.ok || !data?.design) {
                setMessage({ ok: false, text: data?.error ?? 'Could not draft that one. Try different words.' });
                return;
            }

            // A rewrite keeps the banner's identity, so rewording something
            // already saved updates that banner rather than making a second
            // copy of it on the shelf.
            setDesign((prev) => (prev ? { ...data.design, id: prev.id } : data.design));
            setSource(data.source ?? null);
        } catch {
            setMessage({ ok: false, text: 'Could not reach the server. Check your connection.' });
        } finally {
            setGenerating(false);
        }
    };

    const edit = <K extends keyof BannerDesign>(field: K, value: BannerDesign[K]) => {
        setDesign((prev) => (prev ? { ...prev, [field]: value } : prev));
        setMessage(null);
    };

    /** Add or remove one hand-picked product, newest last, capped at the strip. */
    const togglePick = (id: string) => {
        setDesign((prev) => {
            if (!prev) return prev;
            const current = prev.productIds ?? [];
            const next = current.includes(id)
                ? current.filter((p) => p !== id)
                : [...current, id].slice(-STRIP_SIZE);
            return { ...prev, productIds: next };
        });
        setMessage(null);
    };

    /** Save the design to the shelf, or overwrite the one already there. */
    const saveToLibrary = async (quiet = false): Promise<BannerDesign | null> => {
        if (!design) return null;

        setSaving(true);
        if (!quiet) setMessage(null);

        try {
            const res = await fetch('/api/admin/banner-library', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ design }),
            });
            const data = await res.json();

            if (!res.ok) {
                setMessage({ ok: false, text: data?.error ?? 'Could not save that banner.' });
                return null;
            }

            setLibrary(Array.isArray(data.banners) ? data.banners : []);
            if (data.design) setDesign(data.design);

            if (!quiet) {
                setMessage({
                    ok: true,
                    text: isSaved
                        ? 'Saved. Your changes are on the shelf below.'
                        : 'Saved to your banners below. It stays there for good — reuse it any time.',
                });
            }

            return data.design ?? design;
        } catch {
            setMessage({ ok: false, text: 'Could not save. Please check your connection.' });
            return null;
        } finally {
            setSaving(false);
        }
    };

    /**
     * Put the banner on the homepage, or update it where it already sits.
     *
     * The slider is read fresh first: this screen must add to what the Hero tab
     * has in it, never quietly replace it. A banner already in the slider is
     * updated in place so an edit — a new percentage, different products, new
     * dates — reaches the live slide without making a second one.
     */
    const putOnHomepage = async () => {
        if (!design) return;

        setPublishing(true);
        setMessage(null);

        // Keeping the shelf copy and the live copy in step: the shelf is where
        // this banner is edited from next time, so it must not fall behind.
        const saved = (await saveToLibrary(true)) ?? design;

        try {
            const slides = await loadHero();
            const at = slides.findIndex((slide: any) => slide?.design?.id === saved.id);
            const updating = at > -1;

            const slide = {
                // The slide keeps the design's own id, which is what lets an
                // edit find its way back to the right live slide.
                id: `slide-${saved.id}`,
                // No image: the homepage draws this one from the design.
                design: saved,
                alt: saved.alt,
                link: saved.href,
            };

            const value = updating
                ? slides.map((row: any, i: number) => (i === at ? { ...row, ...slide } : row))
                : [...slides, slide];

            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: 'hero', value }),
            });

            if (!res.ok) {
                setMessage({ ok: false, text: 'Could not save. Please try again.' });
                return;
            }

            setHeroSlides(value);
            setMessage({
                ok: true,
                text: updating
                    ? `Updated on the homepage. The live banner now shows these words, prices and dates — it runs until ${readableDate(saved.endsOn)}.`
                    : `Added to the homepage slider as the last slide, running until ${readableDate(saved.endsOn)}. Reorder or remove it in the Hero Banners tab.`,
            });
        } catch {
            setMessage({ ok: false, text: 'Could not save. Please check your connection.' });
        } finally {
            setPublishing(false);
        }
    };

    /** Take the banner off the homepage. The shelf copy is untouched. */
    const takeOffHomepage = async () => {
        if (!design) return;

        setPublishing(true);
        setMessage(null);

        try {
            const slides = await loadHero();
            const value = slides.filter((slide: any) => slide?.design?.id !== design.id);

            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: 'hero', value }),
            });

            if (!res.ok) {
                setMessage({ ok: false, text: 'Could not save. Please try again.' });
                return;
            }

            setHeroSlides(value);
            setMessage({
                ok: true,
                text: 'Taken off the homepage. The banner is still saved below, ready to go back up.',
            });
        } catch {
            setMessage({ ok: false, text: 'Could not save. Please check your connection.' });
        } finally {
            setPublishing(false);
        }
    };

    /** Open a saved banner in the editor above. */
    const openSaved = (banner: BannerDesign) => {
        setDesign(banner);
        setSource(null);
        setConfirmDelete(null);
        setProductSearch('');
        setMessage(
            banner.endsOn < today
                ? {
                      ok: true,
                      text: `This one finished on ${readableDate(banner.endsOn)}. Give it a new last day below, change the offer if it has moved on, then put it back on the homepage.`,
                  }
                : null
        );
        editor.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    /** Start a new banner from a saved one, leaving the original alone. */
    const copySaved = (banner: BannerDesign) => {
        setDesign({
            ...banner,
            id: `studio-${Date.now()}`,
            createdAt: undefined,
            updatedAt: undefined,
            endsOn: isoInDays(14),
        });
        setSource(null);
        setConfirmDelete(null);
        setMessage({
            ok: true,
            text: 'Copied. This is a new banner — edit it and save, and the one you copied stays as it was.',
        });
        editor.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    /** Delete from the shelf. Asks once, inline, rather than in a popup. */
    const deleteSaved = async (id: string) => {
        if (confirmDelete !== id) {
            setConfirmDelete(id);
            return;
        }

        setConfirmDelete(null);

        try {
            const res = await fetch(`/api/admin/banner-library?id=${encodeURIComponent(id)}`, {
                method: 'DELETE',
            });
            const data = await res.json();

            if (!res.ok) {
                setMessage({ ok: false, text: data?.error ?? 'Could not remove that banner.' });
                return;
            }

            setLibrary(Array.isArray(data.banners) ? data.banners : []);
            setMessage({
                ok: true,
                text: heroSlides.some((slide: any) => slide?.design?.id === id)
                    ? 'Removed from your saved banners. It is still on the homepage — remove the slide in the Hero Banners tab if you want it down.'
                    : 'Removed from your saved banners.',
            });
        } catch {
            setMessage({ ok: false, text: 'Could not remove that banner. Check your connection.' });
        }
    };

    /** The design travels to the frame in its URL, so a tweak reloads it. */
    const frameSrc = useMemo(
        () =>
            design
                ? `/admin/banner-frame?d=${encodeURIComponent(JSON.stringify(design))}`
                : '',
        [design]
    );

    /** The catalogue, narrowed to what is worth offering as a hand pick. */
    const pickable = useMemo(() => {
        const query = productSearch.trim().toLowerCase();
        const scoped = design?.productCategory && design.productCategory.toLowerCase() !== 'all';

        return catalogue
            .filter((p) => p.inStock !== false && (p.images?.length ?? 0) > 0)
            .filter((p) =>
                query
                    ? `${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(query)
                    : // With no search, offer the banner's own category first —
                      // that is nearly always what is wanted, and the search box
                      // is there for the exception.
                      !scoped || p.category?.toLowerCase() === design!.productCategory!.toLowerCase()
            )
            .slice(0, 40);
    }, [catalogue, productSearch, design]);

    const desktopFit = useFitScale(DESKTOP_FRAME.width);
    const phoneFit = useFitScale(PHONE_FRAME.width);

    return (
        <div className={styles.container} ref={editor}>
            <div className={styles.header}>
                <div>
                    <h2 className={styles.title}>Banner Studio</h2>
                    <p className={styles.lede}>
                        Say what the banner is for and it gets written, designed and priced
                        for you. Nothing to upload, nothing to crop — the prices come straight
                        out of your catalogue, so the banner is right on the day it goes up and
                        still right a month later. Every banner you make is saved below and can
                        be edited and put back up whenever you want, however long ago it ran.
                    </p>
                </div>
            </div>

            {/* ── The brief ── */}
            <div className={styles.brief}>
                <label className={styles.briefLabel} htmlFor="banner-brief">
                    What is this banner for?
                </label>
                <div className={styles.briefRow}>
                    <input
                        id="banner-brief"
                        className={styles.briefInput}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') generate(prompt);
                        }}
                        placeholder="washing machine sale, 40% off, this weekend"
                        disabled={generating}
                    />
                    <Button onClick={() => generate(prompt)} disabled={generating || !prompt.trim()}>
                        {generating ? 'Designing…' : 'Design it'}
                    </Button>
                </div>

                <div className={styles.examples}>
                    <span className={styles.examplesLabel}>Try:</span>
                    {EXAMPLES.map((example) => (
                        <button
                            key={example}
                            className={styles.example}
                            onClick={() => {
                                setPrompt(example);
                                generate(example);
                            }}
                            disabled={generating}
                        >
                            {example}
                        </button>
                    ))}
                </div>
            </div>

            {message && (
                <p className={`${styles.message} ${message.ok ? styles.messageOk : styles.messageErr}`}>
                    {message.text}
                </p>
            )}

            {!design ? (
                <div className={styles.empty}>
                    <p className={styles.emptyTitle}>Nothing designed yet</p>
                    <p className={styles.emptyNote}>
                        Type a line above, or tap one of the examples, and a finished banner
                        appears here — headline, offer line, button, colours and artwork.
                        You can change any of it afterwards. Or open one of your saved
                        banners below and edit that instead.
                    </p>
                </div>
            ) : (
                <div className={styles.studio}>
                    {/* ── Controls ── */}
                    <div className={styles.controls}>
                        <section className={styles.panel}>
                            <h3 className={styles.panelTitle}>Layout</h3>
                            <div className={styles.layoutGrid}>
                                {LAYOUTS.map((layout) => (
                                    <button
                                        key={layout.id}
                                        className={styles.layoutCard}
                                        data-active={design.layout === layout.id}
                                        onClick={() => edit('layout', layout.id as BannerLayout)}
                                    >
                                        <span className={styles.layoutName}>{layout.name}</span>
                                        <span className={styles.layoutNote}>{layout.note}</span>
                                    </button>
                                ))}
                            </div>
                        </section>

                        <section className={styles.panel}>
                            <h3 className={styles.panelTitle}>Colours</h3>
                            <div className={styles.palettes}>
                                {PALETTES.map((palette) => (
                                    <button
                                        key={palette.id}
                                        className={styles.palette}
                                        data-active={design.theme === palette.id}
                                        onClick={() => edit('theme', palette.id as OccasionTheme)}
                                        title={`${palette.group} — ${palette.name}`}
                                    >
                                        {/* The swatch is the live banner gradient, so what you
                                            pick is literally what you get. */}
                                        <span className={styles.swatch}>
                                            <span
                                                className={bannerStyles.banner}
                                                data-theme={palette.id}
                                            />
                                        </span>
                                        <span className={styles.paletteName}>{palette.name}</span>
                                    </button>
                                ))}
                            </div>
                        </section>

                        <section className={styles.panel}>
                            <h3 className={styles.panelTitle}>Background</h3>
                            <div className={styles.chips}>
                                {PATTERNS.map((pattern) => (
                                    <button
                                        key={pattern.id}
                                        className={styles.chip}
                                        data-active={design.pattern === pattern.id}
                                        onClick={() => edit('pattern', pattern.id as BannerPattern)}
                                    >
                                        {pattern.name}
                                    </button>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* ── Preview and copy ── */}
                    <div className={styles.stage}>
                        <div className={styles.previewHead}>
                            <h3 className={styles.panelTitle}>Exactly what customers will see</h3>
                            <div className={styles.statusRow}>
                                {isLive && !expired && <span className={styles.statusLive}>On the homepage</span>}
                                {expired && <span className={styles.statusExpired}>Finished — not on the site</span>}
                                {isSaved && !isLive && !expired && <span className={styles.statusSaved}>Saved</span>}
                                {source && (
                                    <span className={styles.source}>
                                        {source === 'ai' ? 'Copy written for you' : 'Copy from the house style guide'}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className={styles.previews}>
                            <figure className={styles.previewFigure}>
                                <div
                                    ref={desktopFit.box}
                                    className={styles.preview}
                                    style={{ aspectRatio: `${DESKTOP_FRAME.width} / ${DESKTOP_FRAME.height}` }}
                                >
                                    <iframe
                                        src={frameSrc}
                                        title="Banner preview on a computer"
                                        className={styles.frame}
                                        style={{
                                            width: DESKTOP_FRAME.width,
                                            height: DESKTOP_FRAME.height,
                                            // Shrink the finished frame into the box
                                            // without touching its own viewport.
                                            transform: `scale(${desktopFit.scale})`,
                                        }}
                                    />
                                </div>
                                <figcaption className={styles.previewCaption}>Computer</figcaption>
                            </figure>

                            <figure className={`${styles.previewFigure} ${styles.previewPhone}`}>
                                <div
                                    ref={phoneFit.box}
                                    className={styles.preview}
                                    style={{ aspectRatio: `${PHONE_FRAME.width} / ${PHONE_FRAME.height}` }}
                                >
                                    <iframe
                                        src={frameSrc}
                                        title="Banner preview on a phone"
                                        className={styles.frame}
                                        style={{
                                            width: PHONE_FRAME.width,
                                            height: PHONE_FRAME.height,
                                            transform: `scale(${phoneFit.scale})`,
                                        }}
                                    />
                                </div>
                                <figcaption className={styles.previewCaption}>Phone</figcaption>
                            </figure>
                        </div>

                        {products.length === 0 && (
                            <p className={styles.warn}>
                                No products matched this banner, so it will show the offer without
                                product photos. Check that the category or brand is spelled the way
                                it is in your product list, or pick the products by hand below.
                            </p>
                        )}

                        {expired && (
                            <p className={styles.warn}>
                                This offer ended on {readableDate(design.endsOn)}, so it is not
                                showing on the site. Set a new last day below and put it back up.
                            </p>
                        )}

                        <div className={styles.fields}>
                            <div className={`${styles.field} ${styles.fieldWide}`}>
                                <label className={styles.label}>Small line</label>
                                <input
                                    className={styles.input}
                                    value={design.eyebrow}
                                    onChange={(e) => edit('eyebrow', e.target.value)}
                                />
                            </div>

                            <div className={`${styles.field} ${styles.fieldWide}`}>
                                <label className={styles.label}>Headline</label>
                                <input
                                    className={styles.input}
                                    value={design.headline}
                                    onChange={(e) => edit('headline', e.target.value)}
                                />
                            </div>

                            <div className={`${styles.field} ${styles.fieldWide}`}>
                                <label className={styles.label}>Offer line</label>
                                <input
                                    className={styles.input}
                                    value={design.subline}
                                    onChange={(e) => edit('subline', e.target.value)}
                                />
                            </div>

                            <div className={styles.field}>
                                <label className={styles.label}>Button text</label>
                                <input
                                    className={styles.input}
                                    value={design.ctaLabel}
                                    onChange={(e) => edit('ctaLabel', e.target.value)}
                                />
                            </div>

                            <div className={styles.field}>
                                <label className={styles.label}>Button link</label>
                                <input
                                    className={styles.input}
                                    value={design.href}
                                    onChange={(e) => edit('href', e.target.value)}
                                />
                            </div>

                            <div className={styles.field}>
                                <label className={styles.label}>Discount on the badge</label>
                                <div className={styles.inputWithSuffix}>
                                    <input
                                        className={styles.input}
                                        type="number"
                                        min={0}
                                        max={99}
                                        value={design.discountPercent ?? ''}
                                        placeholder="Auto"
                                        onChange={(e) => {
                                            const raw = e.target.value.trim();
                                            const n = Number(raw);
                                            // Blank means "use the real deepest
                                            // discount", which is not the same as 0.
                                            edit(
                                                'discountPercent',
                                                raw === '' || Number.isNaN(n)
                                                    ? undefined
                                                    : Math.max(0, Math.min(99, Math.round(n)))
                                            );
                                        }}
                                    />
                                    <span className={styles.suffix}>%</span>
                                </div>
                                <p className={styles.hint}>
                                    {design.discountPercent === undefined
                                        ? products.length > 0
                                            ? `Left blank, so the badge shows the biggest real saving in the products below — ${Math.max(
                                                  0,
                                                  ...products.map((p) => p.discount)
                                              )}% today.`
                                            : 'Left blank, so the badge shows the biggest real saving among the products shown.'
                                        : 'Type a number to print it on the badge yourself — for an exchange bonus or a counter discount the prices do not show.'}
                                </p>
                            </div>

                            <div className={styles.field}>
                                <label className={styles.label}>Last day of the offer</label>
                                <input
                                    type="date"
                                    className={styles.input}
                                    value={design.endsOn}
                                    onChange={(e) => edit('endsOn', e.target.value)}
                                />
                                <div className={styles.chips}>
                                    {RUN_LENGTHS.map((run) => (
                                        <button
                                            key={run.label}
                                            className={styles.chip}
                                            data-active={design.endsOn === isoInDays(run.days)}
                                            onClick={() => edit('endsOn', isoInDays(run.days))}
                                            title={`Run until ${readableDate(isoInDays(run.days))}`}
                                        >
                                            {run.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.field}>
                                <label className={styles.label}>Products shown</label>
                                <input
                                    className={styles.input}
                                    value={design.productCategory ?? 'all'}
                                    onChange={(e) => edit('productCategory', e.target.value)}
                                    placeholder="Washing Machines, or all"
                                />
                            </div>

                            <div className={styles.field}>
                                <label className={styles.label}>Only this brand</label>
                                <input
                                    className={styles.input}
                                    list="banner-brands"
                                    value={design.brand ?? ''}
                                    onChange={(e) => edit('brand', e.target.value.trim() || undefined)}
                                    placeholder="Any brand"
                                />
                                <datalist id="banner-brands">
                                    {BRANDS.map((brand) => (
                                        <option key={brand} value={brand} />
                                    ))}
                                </datalist>
                            </div>

                            {/* ── Which products appear ── */}
                            <div className={styles.fieldWide}>
                                <label className={styles.label}>Which products appear on the banner</label>
                                <div className={styles.chips}>
                                    <button
                                        className={styles.chip}
                                        data-active={!handPicked}
                                        onClick={() => edit('productIds', undefined)}
                                    >
                                        Best deals, chosen for me
                                    </button>
                                    <button
                                        className={styles.chip}
                                        data-active={handPicked}
                                        onClick={() =>
                                            edit(
                                                'productIds',
                                                products.slice(0, STRIP_SIZE).map((p) => p.id)
                                            )
                                        }
                                    >
                                        I’ll pick them
                                    </button>
                                </div>

                                {!handPicked ? (
                                    <p className={styles.hint}>
                                        The three biggest savings in{' '}
                                        {design.productCategory && design.productCategory.toLowerCase() !== 'all'
                                            ? design.productCategory
                                            : 'the whole shop'}
                                        {design.brand ? ` from ${design.brand}` : ''} go on the banner, and
                                        change on their own as your prices change.
                                    </p>
                                ) : (
                                    <div className={styles.picker}>
                                        <div className={styles.picked}>
                                            {picks.length === 0 && (
                                                <span className={styles.hint}>
                                                    Nothing picked yet — choose up to {STRIP_SIZE} below.
                                                </span>
                                            )}
                                            {picks.map((id) => {
                                                const product = catalogue.find((p) => p.id === id);
                                                return (
                                                    <button
                                                        key={id}
                                                        className={styles.pickedChip}
                                                        onClick={() => togglePick(id)}
                                                        title="Remove from the banner"
                                                    >
                                                        {product?.name ?? 'Product no longer in your list'}
                                                        <span aria-hidden="true">×</span>
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <input
                                            className={styles.input}
                                            value={productSearch}
                                            onChange={(e) => setProductSearch(e.target.value)}
                                            placeholder="Search your products by name or brand"
                                        />

                                        <div className={styles.pickList}>
                                            {pickable.length === 0 && (
                                                <p className={styles.hint}>
                                                    Nothing matched. Try a different word, or clear the search.
                                                </p>
                                            )}
                                            {pickable.map((product) => (
                                                <button
                                                    key={product.id}
                                                    className={styles.pickRow}
                                                    data-active={picks.includes(product.id)}
                                                    onClick={() => togglePick(product.id)}
                                                >
                                                    <span className={styles.pickName}>{product.name}</span>
                                                    <span className={styles.pickMeta}>
                                                        {product.brand} · {formatPrice(product.price)}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>

                                        <p className={styles.hint}>
                                            Picked products stay on the banner whatever your prices do. The
                                            newest pick replaces the oldest once {STRIP_SIZE} are chosen. Sold
                                            out or missing a photo, and a pick quietly drops off.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className={styles.fieldWide}>
                                <label className={styles.label}>
                                    Alt text — what a blind customer hears, and what Google reads
                                </label>
                                <textarea
                                    className={`${styles.input} ${styles.textarea}`}
                                    value={design.alt}
                                    onChange={(e) => edit('alt', e.target.value)}
                                    rows={3}
                                />
                            </div>
                        </div>

                        <div className={styles.actions}>
                            <Button onClick={putOnHomepage} disabled={publishing || saving}>
                                {publishing
                                    ? isLive
                                        ? 'Updating…'
                                        : 'Adding…'
                                    : isLive
                                      ? 'Update on homepage'
                                      : 'Put on homepage'}
                            </Button>
                            <button
                                className={styles.secondary}
                                onClick={() => saveToLibrary()}
                                disabled={saving || publishing}
                            >
                                {saving ? 'Saving…' : isSaved ? 'Save changes' : 'Save for later'}
                            </button>
                            {isLive && (
                                <button
                                    className={styles.secondary}
                                    onClick={takeOffHomepage}
                                    disabled={publishing || saving}
                                >
                                    Take off homepage
                                </button>
                            )}
                            <button
                                className={styles.secondary}
                                onClick={() => generate(prompt)}
                                disabled={generating || !prompt.trim()}
                            >
                                {generating ? 'Rewriting…' : 'Rewrite the words'}
                            </button>
                            <button
                                className={styles.secondary}
                                onClick={() => {
                                    setDesign(null);
                                    setSource(null);
                                    setProductSearch('');
                                }}
                            >
                                Start again
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── The shelf ── */}
            <section className={styles.shelf}>
                <div className={styles.shelfHead}>
                    <h3 className={styles.panelTitle}>Your banners</h3>
                    <p className={styles.shelfNote}>
                        Every banner you have saved, kept for good. A banner comes off the
                        homepage when its last day passes, but it stays here — open it, give it
                        new dates, change the discount or the products, and put it back up.
                    </p>
                </div>

                {library.length === 0 ? (
                    <p className={styles.shelfEmpty}>
                        Nothing saved yet. Design a banner above and press “Save for later”, or
                        “Put on homepage” — that saves it here too.
                    </p>
                ) : (
                    <ul className={styles.shelfGrid}>
                        {library.map((banner) => {
                            const live = heroSlides.some((slide: any) => slide?.design?.id === banner.id);
                            const over = banner.endsOn < today;

                            return (
                                <li key={banner.id} className={styles.card}>
                                    {/* The strip carries this banner's real colours and
                                        background, so the shelf is scannable at a glance
                                        without rendering a dozen live banners. */}
                                    <div className={styles.cardArt}>
                                        <span
                                            className={bannerStyles.banner}
                                            data-theme={banner.theme}
                                            data-pattern={banner.pattern ?? 'none'}
                                            aria-hidden="true"
                                        />
                                        <span className={styles.cardArtText}>{banner.headline}</span>
                                    </div>

                                    <div className={styles.cardBody}>
                                        <p className={styles.cardEyebrow}>{banner.eyebrow}</p>
                                        <p className={styles.cardSub}>{banner.subline}</p>

                                        <div className={styles.cardTags}>
                                            {live && !over && <span className={styles.statusLive}>On the homepage</span>}
                                            {over && <span className={styles.statusExpired}>Finished</span>}
                                            {banner.discountPercent !== undefined && (
                                                <span className={styles.cardTag}>{banner.discountPercent}% badge</span>
                                            )}
                                            {banner.productIds?.length ? (
                                                <span className={styles.cardTag}>
                                                    {banner.productIds.length} picked product
                                                    {banner.productIds.length === 1 ? '' : 's'}
                                                </span>
                                            ) : null}
                                            {banner.productCategory && banner.productCategory !== 'all' && (
                                                <span className={styles.cardTag}>{banner.productCategory}</span>
                                            )}
                                            {banner.brand && <span className={styles.cardTag}>{banner.brand}</span>}
                                        </div>

                                        <p className={styles.cardDates}>
                                            {over ? 'Ran until' : 'Runs until'} {readableDate(banner.endsOn)}
                                        </p>

                                        <div className={styles.cardActions}>
                                            <button className={styles.cardBtn} onClick={() => openSaved(banner)}>
                                                Edit
                                            </button>
                                            <button className={styles.cardBtn} onClick={() => copySaved(banner)}>
                                                Copy
                                            </button>
                                            <button
                                                className={styles.cardDanger}
                                                onClick={() => deleteSaved(banner.id)}
                                                onBlur={() => setConfirmDelete((id) => (id === banner.id ? null : id))}
                                            >
                                                {confirmDelete === banner.id ? 'Really delete?' : 'Delete'}
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </section>
        </div>
    );
}
