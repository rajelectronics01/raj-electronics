import type { OccasionTheme } from '@/lib/occasions';
import styles from './OccasionBanner.module.css';

/**
 * RAJ ELECTRONICS: FESTIVAL ARTWORK
 *
 * The decorative half of an auto-generated banner — diyas for Diwali, kites for
 * Sankranti, a mango-leaf toran for Ugadi, and so on. Drawn as inline SVG so it
 * stays sharp at any size and costs no image request.
 *
 * Everything here is purely decorative: it sits behind the copy, never affects
 * layout, and is hidden from assistive tech.
 */

/* ─────────────── Individual motifs ─────────────── */

/** Oil lamp — the Diwali/Dussehra signature. */
function Diya({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 64 58" className={className} aria-hidden="true">
            {/* flame */}
            <path d="M32 2c4.5 9 7.5 13.5 7.5 18.5a7.5 7.5 0 0 1-15 0C24.5 15.5 27.5 11 32 2z" fill="#ffcf4d" />
            <path d="M32 11c2.2 4.6 3.7 6.9 3.7 9.4a3.7 3.7 0 0 1-7.4 0c0-2.5 1.5-4.8 3.7-9.4z" fill="#fff6d0" />
            {/* bowl */}
            <path d="M6 34h52c0 11.5-11.6 18-26 18S6 45.5 6 34z" fill="#a8380b" />
            <ellipse cx="32" cy="34" rx="26" ry="5.5" fill="#e0670f" />
            <ellipse cx="32" cy="33" rx="17" ry="3" fill="#7c2d0a" opacity="0.55" />
        </svg>
    );
}

/** Sankranti kite, complete with a curling tail. */
function Kite({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 64 104" className={className} aria-hidden="true">
            <path d="M32 2 60 34 32 68 4 34z" fill="#ffd93d" />
            <path d="M32 2 32 68" stroke="#0b5ea8" strokeWidth="2" opacity="0.5" />
            <path d="M4 34 60 34" stroke="#0b5ea8" strokeWidth="2" opacity="0.5" />
            <path d="M32 2 60 34 32 34z" fill="#ff7a45" opacity="0.85" />
            <path d="M4 34 32 34 32 68z" fill="#e0453c" opacity="0.7" />
            <path
                d="M32 68c7 7-7 11 0 18s-5 10 0 16"
                stroke="#fff1b8"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
            />
        </svg>
    );
}

/** Mango-leaf toran — hung over doorways at Ugadi. */
function Toran({ className }: { className?: string }) {
    const leaves = Array.from({ length: 16 }, (_, i) => i);
    return (
        <svg viewBox="0 0 480 64" className={className} preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 6Q240 40 480 6" stroke="#b98a34" strokeWidth="3" fill="none" />
            {leaves.map((i) => {
                const x = 12 + i * 30.5;
                // Follow the sag of the string.
                const t = i / (leaves.length - 1);
                const y = 6 + Math.sin(t * Math.PI) * 26;
                return (
                    <path
                        key={i}
                        d={`M${x} ${y}c-7 12-7 26 0 36 7-10 7-24 0-36z`}
                        fill={i % 2 === 0 ? '#2f7d32' : '#4a9e3a'}
                    />
                );
            })}
        </svg>
    );
}

/** Burst of light — fireworks for Diwali and New Year. */
function Burst({ className }: { className?: string }) {
    const rays = Array.from({ length: 12 }, (_, i) => (i * 360) / 12);
    return (
        <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
            {rays.map((deg) => (
                <g key={deg} transform={`rotate(${deg} 60 60)`}>
                    <path d="M60 60 60 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
                    <circle cx="60" cy="12" r="3" fill="currentColor" />
                </g>
            ))}
            <circle cx="60" cy="60" r="6" fill="currentColor" />
        </svg>
    );
}

/** Cooling motif for the summer campaign. */
function Snowflake({ className }: { className?: string }) {
    const arms = [0, 60, 120];
    return (
        <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
            {arms.map((deg) => (
                <g key={deg} transform={`rotate(${deg} 50 50)`} stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <path d="M50 8 50 92" />
                    <path d="M50 20 40 30M50 20 60 30" />
                    <path d="M50 80 40 70M50 80 60 70" />
                </g>
            ))}
        </svg>
    );
}

/** Crescent and star, for Eid. */
function Crescent({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
            <path d="M62 8a42 42 0 1 0 0 84 34 34 0 1 1 0-84z" fill="currentColor" />
            <path d="M78 34l4.5 9.5 10.5 1.5-7.5 7.3 1.8 10.4-9.3-4.9-9.3 4.9 1.8-10.4-7.5-7.3 10.5-1.5z" fill="currentColor" />
        </svg>
    );
}

/** Holi colour splash. */
function Splash({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
            <path
                d="M60 10c14 6 26 0 32 12s-4 22 2 32-12 18-16 28-20 4-32 8-20-8-30-12S2 60 8 50s2-24 12-30 26 0 40-10z"
                fill="currentColor"
            />
        </svg>
    );
}

/** Tricolour ribbon, for Republic and Independence Day. */
function Ribbon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 480 120" className={className} preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 18Q120 0 240 18T480 18V40Q360 22 240 40T0 40z" fill="#ff9933" opacity="0.85" />
            <path d="M0 40Q120 22 240 40T480 40V62Q360 44 240 62T0 62z" fill="#ffffff" opacity="0.75" />
            <path d="M0 62Q120 44 240 62T480 62V84Q360 66 240 84T0 84z" fill="#138808" opacity="0.85" />
        </svg>
    );
}

/** Bow and arrow — Dussehra marks Ram's victory. */
function Bow({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
            <path d="M30 10a78 78 0 0 1 0 100" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M30 10 26 60 30 110" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.7" />
            <path d="M26 60H104" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M104 60 90 52v16z" fill="currentColor" />
            <path d="M34 60l-8-7M34 60l-8 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
    );
}


/** Rangoli medallion — the floor pattern behind the product stage. */
export function Rangoli({ className }: { className?: string }) {
    const petals = Array.from({ length: 16 }, (_, i) => (i * 360) / 16);
    const inner = Array.from({ length: 8 }, (_, i) => (i * 360) / 8);
    return (
        <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
            {petals.map((deg) => (
                <ellipse
                    key={deg}
                    cx="100"
                    cy="34"
                    rx="9"
                    ry="30"
                    transform={`rotate(${deg} 100 100)`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                />
            ))}
            {inner.map((deg) => (
                <ellipse
                    key={deg}
                    cx="100"
                    cy="62"
                    rx="7"
                    ry="20"
                    transform={`rotate(${deg + 22} 100 100)`}
                    fill="currentColor"
                    opacity="0.35"
                />
            ))}
            <circle cx="100" cy="100" r="17" fill="none" stroke="currentColor" strokeWidth="2.2" />
            <circle cx="100" cy="100" r="7" fill="currentColor" />
        </svg>
    );
}

/** Scattered four-point sparkles, for a bit of festive glitter. */
export function Sparkles({ className }: { className?: string }) {
    const stars = [
        [12, 22, 7], [26, 68, 5], [41, 14, 6], [58, 44, 4],
        [67, 78, 6], [79, 20, 5], [88, 58, 7], [34, 88, 4],
        [52, 8, 5], [94, 34, 4],
    ];
    return (
        <svg viewBox="0 0 100 100" className={className} preserveAspectRatio="none" aria-hidden="true">
            {stars.map(([x, y, r], i) => (
                <path
                    key={i}
                    d={`M${x} ${y - r}Q${x + r * 0.22} ${y - r * 0.22} ${x + r} ${y}Q${x + r * 0.22} ${y + r * 0.22} ${x} ${y + r}Q${x - r * 0.22} ${y + r * 0.22} ${x - r} ${y}Q${x - r * 0.22} ${y - r * 0.22} ${x} ${y - r}z`}
                    fill="currentColor"
                    opacity={0.35 + (i % 3) * 0.2}
                />
            ))}
        </svg>
    );
}

/* ─────────────── Per-theme compositions ─────────────── */

function repeat(n: number) {
    return Array.from({ length: n }, (_, i) => i);
}

export default function OccasionDecor({ theme }: { theme: OccasionTheme }) {
    return (
        <div className={styles.art} aria-hidden="true">
            <Sparkles className={styles.sparkles} />
            {themeMotifs(theme)}
        </div>
    );
}

function themeMotifs(theme: OccasionTheme) {
    switch (theme) {
        case 'diwali':
            return (
                <>
                    <Burst className={`${styles.burst} ${styles.burstA}`} />
                    <Burst className={`${styles.burst} ${styles.burstB}`} />
                    <div className={styles.diyaRow}>
                        {repeat(7).map((i) => (
                            <Diya key={i} className={styles.diya} />
                        ))}
                    </div>
                </>
            );

        case 'dussehra':
            return (
                <>
                    <Bow className={styles.bow} />
                    <div className={styles.diyaRow}>
                        {repeat(7).map((i) => (
                            <Diya key={i} className={styles.diya} />
                        ))}
                    </div>
                </>
            );

        case 'ganesh':
            return (
                <>
                    <Toran className={styles.toran} />
                    <div className={styles.diyaRow}>
                        {repeat(6).map((i) => (
                            <Diya key={i} className={styles.diya} />
                        ))}
                    </div>
                </>
            );

        case 'ugadi':
            return (
                <>
                    <Toran className={styles.toran} />
                </>
            );

        case 'sankranti':
            return (
                <>
                    <Kite className={`${styles.kite} ${styles.kiteA}`} />
                    <Kite className={`${styles.kite} ${styles.kiteB}`} />
                    <Kite className={`${styles.kite} ${styles.kiteC}`} />
                </>
            );

        case 'holi':
            return (
                <>
                    <Splash className={`${styles.splash} ${styles.splashA}`} />
                    <Splash className={`${styles.splash} ${styles.splashB}`} />
                    <Splash className={`${styles.splash} ${styles.splashC}`} />
                </>
            );

        case 'eid':
            return (
                <>
                    <Crescent className={styles.crescent} />
                    <div className={styles.diyaRow}>
                        {repeat(6).map((i) => (
                            <Diya key={i} className={styles.diya} />
                        ))}
                    </div>
                </>
            );

        case 'summer':
            return (
                <>
                    <Snowflake className={`${styles.flake} ${styles.flakeA}`} />
                    <Snowflake className={`${styles.flake} ${styles.flakeB}`} />
                    <Snowflake className={`${styles.flake} ${styles.flakeC}`} />
                </>
            );

        case 'tricolour':
            return (
                <>
                    <Ribbon className={styles.ribbon} />
                </>
            );

        case 'newyear':
            return (
                <>
                    <Burst className={`${styles.burst} ${styles.burstA}`} />
                    <Burst className={`${styles.burst} ${styles.burstB}`} />
                    <Burst className={`${styles.burst} ${styles.burstC}`} />
                </>
            );

        default:
            return (
                <>
                    <Burst className={`${styles.burst} ${styles.burstA}`} />
                </>
            );
    }
}
