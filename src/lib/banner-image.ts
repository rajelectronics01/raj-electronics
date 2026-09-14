import { Jimp } from 'jimp';

/**
 * RAJ ELECTRONICS: BANNER AUTO-FIT
 *
 * The hero slider needs two very different shapes — an ultra-wide strip on
 * desktop and a near-square on phones — and artwork rarely arrives in either.
 * Rather than making whoever uploads it crop by hand (or letting the slider
 * silently eat the edges, which is what used to happen), we generate both
 * sizes here from whatever single image is given.
 *
 * Sizes mirror the aspect ratios in Hero.module.css. If those change, change
 * these with them.
 */

export const HERO_DESKTOP = { w: 1920, h: 500 } as const; // 3.84 : 1
export const HERO_MOBILE = { w: 1125, h: 825 } as const; //  1.36 : 1

/** Longest edge we keep for ordinary (non-banner) images such as product shots. */
const PLAIN_MAX_EDGE = 1600;

/**
 * How far an image's shape may drift from the frame before cropping it would
 * start cutting real content. Within this, a plain crop is invisible and
 * gives the cleanest, full-bleed result.
 */
const CROP_TOLERANCE = 0.14;

export interface FittedImage {
    buffer: Buffer;
    width: number;
    height: number;
    /** How the image was made to fit — surfaced to the admin so it is never a surprise. */
    method: 'cropped' | 'letterboxed';
}

type Frame = { w: number; h: number };

/**
 * Fit one image to one frame.
 *
 * Close shapes are simply cropped. Anything further off is letterboxed over a
 * blurred, darkened copy of itself — the frame still fills edge to edge, but
 * none of the original artwork is thrown away. It is the same trick video and
 * social apps use for off-ratio uploads, and it beats both bare bars and a
 * crop that decapitates the offer text.
 */
async function fitToFrame(source: Buffer, frame: Frame): Promise<FittedImage> {
    const image = await Jimp.read(source);
    const sourceRatio = image.bitmap.width / image.bitmap.height;
    const frameRatio = frame.w / frame.h;
    const drift = Math.abs(sourceRatio - frameRatio) / frameRatio;

    if (drift <= CROP_TOLERANCE) {
        const cropped = image.clone().cover({ w: frame.w, h: frame.h });
        return {
            buffer: Buffer.from(await cropped.getBuffer('image/jpeg', { quality: 86 })),
            width: frame.w,
            height: frame.h,
            method: 'cropped',
        };
    }

    const backdrop = image
        .clone()
        .cover({ w: frame.w, h: frame.h })
        .blur(Math.max(8, Math.round(frame.w / 90)))
        // jimp v1's brightness is a 0-1 MULTIPLIER, not the -1..+1 delta v0 took.
        // A negative value here clamps every pixel to black.
        .brightness(0.68);

    // Scale and place by hand rather than using contain(): contain() pads with
    // an opaque background colour, which would cover the blurred backdrop and
    // leave plain black bars.
    const scale = Math.min(frame.w / image.bitmap.width, frame.h / image.bitmap.height);
    const innerW = Math.max(1, Math.round(image.bitmap.width * scale));
    const innerH = Math.max(1, Math.round(image.bitmap.height * scale));

    const foreground = image.clone().resize({ w: innerW, h: innerH });

    const composed = backdrop.composite(
        foreground,
        Math.round((frame.w - innerW) / 2),
        Math.round((frame.h - innerH) / 2)
    );

    return {
        buffer: Buffer.from(await composed.getBuffer('image/jpeg', { quality: 86 })),
        width: frame.w,
        height: frame.h,
        method: 'letterboxed',
    };
}

/** Both hero sizes, generated from one uploaded image. */
export async function buildHeroVariants(source: Buffer): Promise<{
    desktop: FittedImage;
    mobile: FittedImage;
    original: { width: number; height: number };
}> {
    const probe = await Jimp.read(source);

    // Sequential on purpose: two full-size decodes at once is the quickest way
    // to hit the memory ceiling of a serverless function.
    const desktop = await fitToFrame(source, HERO_DESKTOP);
    const mobile = await fitToFrame(source, HERO_MOBILE);

    return {
        desktop,
        mobile,
        original: { width: probe.bitmap.width, height: probe.bitmap.height },
    };
}

/**
 * Ordinary images — product shots, gallery photos. Shape is left alone; we only
 * cap the size so a 6 MB phone photo does not become a 6 MB page weight.
 */
export async function optimiseImage(source: Buffer): Promise<FittedImage> {
    const image = await Jimp.read(source);
    const { width, height } = image.bitmap;
    const longest = Math.max(width, height);

    if (longest > PLAIN_MAX_EDGE) {
        const scale = PLAIN_MAX_EDGE / longest;
        image.resize({ w: Math.round(width * scale), h: Math.round(height * scale) });
    }

    return {
        buffer: Buffer.from(await image.getBuffer('image/jpeg', { quality: 88 })),
        width: image.bitmap.width,
        height: image.bitmap.height,
        method: 'cropped',
    };
}
