import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { z } from 'zod';
import { draftFromPrompt, readPrompt, buildAlt, type BannerDesign } from '@/lib/banner-templates';
import { todayInIST } from '@/lib/occasions';

/**
 * RAJ ELECTRONICS: BANNER STUDIO COPYWRITER
 *
 * Turns "washing machine sale 40% off this weekend" into finished banner copy.
 *
 * The facts — which category, which brand, what discount, how long it runs —
 * are read from the prompt in code, not asked of the model. The model is only
 * asked for the words. That ordering matters: a headline that reads badly is a
 * nuisance, but a banner that links to the wrong category, or quietly invents a
 * discount the shop never offered, is a problem with a customer at the counter.
 *
 * Without ANTHROPIC_API_KEY this still works — it returns the rule-based draft,
 * which is the same thing the model is asked to improve on.
 *
 * Admin-only: /api/admin/* sits behind the admin token in middleware.ts.
 */

/** What the copywriter is allowed to decide. Everything else is already fixed. */
const CopySchema = z.object({
    eyebrow: z.string().describe('Small line above the headline. Max 4 words.'),
    headline: z.string().describe('The big line. Max 5 words, title case, no full stop.'),
    subline: z.string().describe('One supporting sentence naming the offer. Max 14 words.'),
    ctaLabel: z.string().describe('Button text. Max 4 words, starts with a verb.'),
});

const SYSTEM = `You write banner copy for Raj Electronics, an electronics shop on RP Road, Secunderabad, trading since 1995. The banners run across the top of the shop's homepage.

House style:
- Plain, confident, specific. Short words. No exclamation marks, no "Hurry!", no "Don't miss out".
- Indian English. Rupee prices as ₹. Never translate or transliterate brand names.
- Say what the shop actually does: free delivery, free installation, EMI, exchange, authorised dealer, 30 years on the same road.
- Never invent a discount, a price, a date, a stock claim or a guarantee. If a saving is given to you, you may use it; if not, do not mention any number.
- Never claim to beat a competitor by name.

The headline carries the message on a wide strip read in two seconds. Make it concrete — "Laundry Day, Sorted" beats "Great Offers On Washing Machines".`;

export async function POST(req: Request) {
    let prompt = '';

    try {
        const body = await req.json();
        prompt = typeof body?.prompt === 'string' ? body.prompt.trim() : '';
    } catch {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    if (!prompt) {
        return NextResponse.json({ error: 'Tell the studio what the banner is for.' }, { status: 400 });
    }

    // Over-long prompts are a paste accident, not a brief.
    if (prompt.length > 500) prompt = prompt.slice(0, 500);

    // The draft is built first and always: it fixes the category, brand, link,
    // colours, layout and end date, and it is what we return if the model is
    // unavailable or answers with something unusable.
    const draft = draftFromPrompt(prompt, todayInIST());
    const reading = readPrompt(prompt);

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ design: draft, source: 'rules' as const });
    }

    try {
        const client = new Anthropic({ apiKey });

        const response = await client.messages.parse({
            model: 'claude-opus-5-5',
            max_tokens: 2000,
            // Deliberately short, formulaic output — the cheapest setting that
            // does this well, so the studio stays quick to click around in.
            output_config: {
                effort: 'low',
                format: zodOutputFormat(CopySchema),
            },
            system: SYSTEM,
            messages: [
                {
                    role: 'user',
                    content: [
                        `Write the copy for this banner.`,
                        ``,
                        `What the shopkeeper asked for: "${prompt}"`,
                        ``,
                        `Already decided, do not contradict:`,
                        `- Products shown: ${draft.productCategory ?? 'the whole shop'}`,
                        reading.brand ? `- Brand: ${reading.brand.brand}` : `- No single brand`,
                        reading.discount
                            ? `- Saving you may mention: up to ${reading.discount}% off`
                            : `- No discount was given, so do not mention any number`,
                        reading.festival ? `- Festival: ${reading.festival.name}` : null,
                        `- The button links to ${draft.href}`,
                        ``,
                        `For reference, the house fallback copy is "${draft.headline}" / "${draft.subline}". Beat it if you can; match its restraint if you cannot.`,
                    ]
                        .filter(Boolean)
                        .join('\n'),
                },
            ],
        });

        const copy = response.parsed_output;
        if (!copy) {
            return NextResponse.json({ design: draft, source: 'rules' as const });
        }

        // The model's words, everything else the draft's. Alt text is rewritten
        // from the final wording so it can never describe the previous draft.
        const design: BannerDesign = {
            ...draft,
            eyebrow: copy.eyebrow,
            headline: copy.headline,
            subline: copy.subline,
            ctaLabel: copy.ctaLabel,
            alt: buildAlt({
                eyebrow: copy.eyebrow,
                headline: copy.headline,
                subject: reading.category?.noun ?? 'ACs, TVs, fridges and washing machines',
                discount: reading.discount,
                brand: reading.brand?.brand,
            }),
        };

        return NextResponse.json({ design, source: 'ai' as const });
    } catch (err) {
        // A copywriter being down is not a reason to leave the shop without a
        // banner — the draft is serviceable on its own.
        console.error('Banner studio copywriter failed:', err);
        return NextResponse.json({ design: draft, source: 'rules' as const });
    }
}
