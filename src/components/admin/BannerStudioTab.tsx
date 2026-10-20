"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Button from '@/components/ui/Button';
import { pickBannerProducts } from '@/lib/occasions';
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
 */

/** Briefs that show what the box expects, in the shop's own words. */
const EXAMPLES = [
    'washing machine sale, 40% off, this weekend',
    'Crompton fans and coolers, brand week',
    'Diwali offer on smart TVs',
    'exchange your old fridge, extra value this month',
    'TG Smart ACs, lowest price in Secunderabad',
];

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
    const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
    const [catalogue, setCatalogue] = useState<Product[]>([]);

    useEffect(() => {
        fetch('/api/products')
            .then((res) => res.json())
            .then((rows) => setCatalogue(Array.isArray(rows) ? rows : []))
            .catch(() => setCatalogue([]));
    }, []);

    /** The same products the homepage would put in this banner. */
    const products = useMemo(
        () =>
            design
                ? pickBannerProducts(
                      catalogue,
                      { category: design.productCategory, brand: design.brand },
                      3
                  )
                : [],
        [catalogue, design]
    );

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

            setDesign(data.design);
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

    /** Append the finished banner to the homepage slider. */
    const addToHomepage = async () => {
        if (!design) return;

        setSaving(true);
        setMessage(null);

        try {
            // Read the current slides first: this screen must add to the slider,
            // never quietly replace what the Hero tab has in it.
            const current = await fetch('/api/admin/settings?key=hero').then((r) => r.json());
            const slides = Array.isArray(current?.data) ? current.data : [];

            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    key: 'hero',
                    value: [
                        ...slides,
                        {
                            // Fresh each time: saving the same design twice must
                            // not put two slides with one id into the slider.
                            id: `studio-${Date.now()}`,
                            // No image: the homepage draws this one from the design.
                            design,
                            alt: design.alt,
                            link: design.href,
                        },
                    ],
                }),
            });

            setMessage(
                res.ok
                    ? {
                          ok: true,
                          text: 'Added to the homepage slider as the last slide. Reorder or remove it in the Hero Banners tab.',
                      }
                    : { ok: false, text: 'Could not save. Please try again.' }
            );
        } catch {
            setMessage({ ok: false, text: 'Could not save. Please check your connection.' });
        } finally {
            setSaving(false);
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

    const desktopFit = useFitScale(DESKTOP_FRAME.width);
    const phoneFit = useFitScale(PHONE_FRAME.width);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h2 className={styles.title}>Banner Studio</h2>
                    <p className={styles.lede}>
                        Say what the banner is for and it gets written, designed and priced
                        for you. Nothing to upload, nothing to crop — the prices come straight
                        out of your catalogue, so the banner is right on the day it goes up and
                        still right a month later.
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
                        You can change any of it afterwards.
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
                            {source && (
                                <span className={styles.source}>
                                    {source === 'ai' ? 'Copy written for you' : 'Copy from the house style guide'}
                                </span>
                            )}
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
                                it is in your product list.
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
                                <label className={styles.label}>Last day of the offer</label>
                                <input
                                    type="date"
                                    className={styles.input}
                                    value={design.endsOn}
                                    onChange={(e) => edit('endsOn', e.target.value)}
                                />
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
                            <Button onClick={addToHomepage} disabled={saving}>
                                {saving ? 'Adding…' : 'Add to homepage'}
                            </Button>
                            <button
                                className={styles.secondary}
                                onClick={() => generate(prompt)}
                                disabled={generating || !prompt.trim()}
                            >
                                {generating ? 'Rewriting…' : 'Rewrite the words'}
                            </button>
                            <button className={styles.secondary} onClick={() => { setDesign(null); setSource(null); }}>
                                Start again
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
