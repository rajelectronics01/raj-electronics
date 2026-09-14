import { NextResponse } from 'next/server';
import { buildHeroVariants, optimiseImage } from '@/lib/banner-image';
import { putImage, storageConfigured } from '@/lib/storage';

/**
 * RAJ ELECTRONICS: IMAGE UPLOAD
 *
 * Two modes:
 *   mode=hero   one image in, both hero sizes out (1920×500 and 1125×825),
 *               auto-fitted so nothing has to be cropped by hand.
 *   default     product and gallery shots — shape untouched, size capped.
 *
 * Admin-only; the middleware gates this route.
 */

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const files = formData.getAll('files').filter((f): f is File => f instanceof File);
        const mode = String(formData.get('mode') || 'plain');

        if (files.length === 0) {
            return NextResponse.json({ error: 'No files provided' }, { status: 400 });
        }

        const urls: string[] = [];
        const variants: Array<{ desktop: string; mobile: string; method: string; note: string }> = [];

        for (const file of files) {
            if (!file.type.startsWith('image/')) {
                return NextResponse.json(
                    { error: `"${file.name}" is not an image.` },
                    { status: 400 }
                );
            }

            const source = Buffer.from(await file.arrayBuffer());

            if (mode === 'hero') {
                const fitted = await buildHeroVariants(source);

                const [desktopUrl, mobileUrl] = await Promise.all([
                    putImage(fitted.desktop.buffer, file.name, 'desktop'),
                    putImage(fitted.mobile.buffer, file.name, 'mobile'),
                ]);

                urls.push(desktopUrl);
                variants.push({
                    desktop: desktopUrl,
                    mobile: mobileUrl,
                    method: fitted.desktop.method,
                    note: describeFit(fitted.original, fitted.desktop.method, fitted.mobile.method),
                });
            } else {
                const optimised = await optimiseImage(source);
                urls.push(await putImage(optimised.buffer, file.name));
            }
        }

        return NextResponse.json({
            urls,
            variants,
            // Surfaced so the admin screen can warn that uploads are local-only.
            durable: storageConfigured(),
        });
    } catch (error: any) {
        console.error('Upload failed:', error);
        return NextResponse.json(
            { error: error?.message || 'Upload failed. Please try again.' },
            { status: 500 }
        );
    }
}

/** Plain-English summary of what we did to the artwork, for the admin screen. */
function describeFit(
    original: { width: number; height: number },
    desktopMethod: string,
    mobileMethod: string
) {
    const size = `${original.width}×${original.height}`;

    if (desktopMethod === 'cropped' && mobileMethod === 'cropped') {
        return `Your ${size} image was close to both hero shapes, so it was cropped to fit cleanly.`;
    }

    const padded = [
        desktopMethod === 'letterboxed' ? 'desktop' : null,
        mobileMethod === 'letterboxed' ? 'mobile' : null,
    ]
        .filter(Boolean)
        .join(' and ');

    return `Your ${size} image was too different in shape to crop, so the ${padded} version keeps the whole picture on a blurred background. For the sharpest result, design at 1920×500 and 1125×825.`;
}
