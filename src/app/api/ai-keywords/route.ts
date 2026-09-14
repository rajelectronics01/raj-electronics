import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { productName, category } = await req.json();

        if (!productName) {
            return NextResponse.json({ error: 'Product name required' }, { status: 400 });
        }

        const prompt = `You are an SEO expert for Raj Electronics, an authorized electronics dealer in Secunderabad Hyderabad India. Generate high-ranking SEO keywords for the given product. Include: local keywords (Hyderabad, Secunderabad, nearby areas), buying intent keywords, bulk/B2B keywords, long-tail keywords, and brand+product keywords. Return only a JSON array of strings. No explanation.
        
Product: ${productName}
Category: ${category}`;

        // Attempt to call Anthropic API directly if key is available
        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey) {
            // Mock response if no API key is set for testing
            console.log('No ANTHROPIC_API_KEY found, returning mock keywords.');
            return NextResponse.json({
                keywords: [
                    `${productName} price Secunderabad`,
                    `buy ${productName} Hyderabad`,
                    `best price ${productName} RP Road`,
                    `authorized dealer ${category} Secunderabad`,
                    `bulk ${category} supplier Hyderabad`
                ]
            });
        }

        const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 1024,
                messages: [
                    { role: 'user', content: prompt }
                ]
            })
        });

        if (!anthropicRes.ok) {
            const err = await anthropicRes.text();
            console.error('Anthropic API Error:', err);
            throw new Error('Failed to generate keywords via AI');
        }

        const anthropicData = await anthropicRes.json();
        const textContent = anthropicData.content?.[0]?.text || '';
        
        let keywords = [];
        try {
            // Extract JSON array from text
            const match = textContent.match(/\[[\s\S]*\]/);
            if (match) {
                keywords = JSON.parse(match[0]);
            } else {
                keywords = JSON.parse(textContent);
            }
        } catch (e) {
            console.error('Failed to parse Claude output as JSON:', textContent);
            return NextResponse.json({ error: 'Invalid AI response' }, { status: 500 });
        }

        return NextResponse.json({ keywords });

    } catch (err: any) {
        console.error('AI Keywords Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
