import { createClient } from '@supabase/supabase-js';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

/**
 * RAJ ELECTRONICS: IMAGE STORAGE
 *
 * Uploads used to be written straight into public/uploads. That works on a
 * laptop and fails on Vercel, whose filesystem is read-only — which is why
 * banner images only ever reached the live site by being deployed from a
 * machine that happened to have them on disk.
 *
 * Supabase Storage is the real destination. The local-disk path is kept purely
 * so `npm run dev` still works before the env vars are set.
 */

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'media';

/**
 * The server-side key, under either name Supabase has used for it.
 *
 * Supabase renamed these: the old `service_role` JWT is now the "secret" key
 * (`sb_secret_…`). Both still work and go in the same place, so accept either
 * spelling rather than making whoever sets this guess which one we wanted.
 *
 * Never prefixed NEXT_PUBLIC_ — that would ship a key that bypasses every
 * security rule to the browser.
 */
function serverKey() {
    return (
        process.env.SUPABASE_SECRET_KEY ||
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        ''
    );
}

/**
 * Catch the publishable/anon key being pasted in by mistake. It looks valid and
 * connects fine, then fails every upload with an opaque row-level-security
 * error — worth naming up front instead.
 */
function keyIsPublishable(key: string) {
    if (key.startsWith('sb_publishable_')) return true;

    // Legacy keys are JWTs carrying their role in the payload.
    if (key.startsWith('eyJ')) {
        try {
            const payload = JSON.parse(
                Buffer.from(key.split('.')[1], 'base64').toString('utf8')
            );
            return payload?.role === 'anon';
        } catch {
            return false;
        }
    }

    return false;
}

function serviceClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = serverKey();
    if (!url || !key) return null;

    if (keyIsPublishable(key)) {
        throw new Error(
            'The Supabase key configured for uploads is the publishable (anon) key. ' +
                'Uploads need the secret key — Supabase → Settings → API Keys → ' +
                '"secret" (shown as "service_role" on older projects).'
        );
    }

    return createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false },
    });
}

/** Whether uploads will survive a deploy. False means local disk only. */
export function storageConfigured() {
    return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && serverKey());
}

/** Storage is the only durable option once deployed. */
export function storageIsDurable() {
    return storageConfigured() || process.env.NODE_ENV !== 'production';
}

function safeName(original: string, suffix?: string) {
    const cleaned = original
        .replace(/\.[^.]+$/, '')
        .replace(/[^a-zA-Z0-9\-_]/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 60)
        .replace(/^-|-$/g, '');

    return `${Date.now()}-${cleaned || 'image'}${suffix ? `-${suffix}` : ''}.jpg`;
}

/**
 * Store one image and return the URL to reference it by.
 * Throws with an actionable message rather than a raw filesystem error.
 */
export async function putImage(
    body: Buffer,
    originalName: string,
    suffix?: string
): Promise<string> {
    const name = safeName(originalName, suffix);
    const supabase = serviceClient();

    if (supabase) {
        const { error } = await supabase.storage.from(BUCKET).upload(name, body, {
            contentType: 'image/jpeg',
            upsert: true,
            cacheControl: '31536000',
        });

        if (error) {
            const hint = /not found/i.test(error.message)
                ? ` — create a public bucket named "${BUCKET}" in Supabase → Storage.`
                : '';
            throw new Error(`Could not save to Supabase Storage: ${error.message}${hint}`);
        }

        return supabase.storage.from(BUCKET).getPublicUrl(name).data.publicUrl;
    }

    // ── Local development only ──
    if (process.env.NODE_ENV === 'production') {
        throw new Error(
            'Image storage is not configured. Add NEXT_PUBLIC_SUPABASE_URL and ' +
                'SUPABASE_SECRET_KEY (Supabase → Settings → API Keys → "secret", ' +
                'shown as "service_role" on older projects) so uploads are saved to ' +
                'Supabase Storage — the server filesystem here is read-only.'
        );
    }

    const dir = join(process.cwd(), 'public', 'uploads');
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, name), body);
    return `/uploads/${name}`;
}
