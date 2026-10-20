"use client";

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import OccasionBanner from '@/components/home/OccasionBanner';
import { pickBannerProducts, type BannerProduct } from '@/lib/occasions';
import { designToOccasion, type BannerDesign } from '@/lib/banner-templates';
import type { Product } from '@/types';

/**
 * RAJ ELECTRONICS: BANNER STUDIO PREVIEW FRAME
 *
 * The studio shows its previews through this page in an iframe, which exists
 * for one reason: the banner sizes its type in `vw` and switches to its phone
 * layout on a `max-width` query, and both of those read the *viewport*, not the
 * box the banner happens to sit in. Scaling a preview down inside the studio
 * page would therefore show type at the wrong size, and would show the desktop
 * layout in the phone preview — flattering, and wrong.
 *
 * An iframe has a viewport of its own. Sized to 1440px wide it renders what a
 * customer on a laptop sees; sized to 390px it crosses the 768px breakpoint and
 * renders the real phone banner.
 *
 * Admin-only by virtue of living under /admin — see middleware.ts.
 */

function Frame() {
    const params = useSearchParams();
    const [products, setProducts] = useState<BannerProduct[]>([]);

    let design: BannerDesign | null = null;
    try {
        const raw = params.get('d');
        if (raw) design = JSON.parse(raw) as BannerDesign;
    } catch {
        design = null;
    }

    const category = design?.productCategory;
    const brand = design?.brand;

    useEffect(() => {
        let cancelled = false;

        fetch('/api/products')
            .then((res) => res.json())
            .then((rows: unknown) => {
                if (cancelled) return;
                const catalogue = Array.isArray(rows) ? (rows as Product[]) : [];
                setProducts(pickBannerProducts(catalogue, { category, brand }, 3));
            })
            .catch(() => undefined);

        return () => {
            cancelled = true;
        };
    }, [category, brand]);

    if (!design) return null;

    return <OccasionBanner occasion={designToOccasion(design)} products={products} />;
}

export default function BannerFramePage() {
    return (
        <>
            {/*
              The root layout wraps every page in the shop's header, footer and
              floating buttons. Rather than guess at selectors to hide them —
              which would break the day the layout changes — the banner is laid
              over the lot: this page is only ever seen through an iframe.
            */}
            <style>{`
                html, body { margin: 0; padding: 0; overflow: hidden; }
            `}</style>
            <div
                id="banner-frame"
                style={{
                    position: 'fixed',
                    inset: 0,
                    overflow: 'hidden',
                    background: '#fff',
                    zIndex: 2147483647,
                }}
            >
                <Suspense fallback={null}>
                    <Frame />
                </Suspense>
            </div>
        </>
    );
}
