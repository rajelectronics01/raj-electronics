import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { productName, category, brand } = await req.json();

        if (!productName) {
            return NextResponse.json({ error: 'Product name required' }, { status: 400 });
        }

        const prompt = `You are an expert copywriter for an electronics e-commerce store. Generate 5-7 persuasive, high-impact bullet point features for the given product. Keep them concise, focusing on benefits and technical specs. Return only a JSON array of strings where each string is a feature. No explanation or introductory text.
        
Brand: ${brand || 'Unknown'}
Product: ${productName}
Category: ${category}`;

        // Attempt to call Anthropic API directly if key is available
        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey) {
            console.log('No ANTHROPIC_API_KEY found, returning mock features.');
            return NextResponse.json({
                features: [
                    `Premium ${brand || ''} build quality for long-lasting durability`,
                    `Energy-efficient performance to reduce electricity bills`,
                    `Advanced cooling/display technology for superior experience`,
                    `Smart connectivity features for modern homes`,
                    `100% Genuine product with full manufacturer warranty`
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
            throw new Error('Failed to generate features via AI');
        }

        const anthropicData = await anthropicRes.json();
        const textContent = anthropicData.content?.[0]?.text || '';
        
        let features = [];
        try {
            // Extract JSON array from text
            const match = textContent.match(/\[[\s\S]*\]/);
            if (match) {
                features = JSON.parse(match[0]);
            } else {
                features = JSON.parse(textContent);
            }
        } catch (e) {
            console.error('Failed to parse Claude output as JSON:', textContent);
            return NextResponse.json({ error: 'Invalid AI response' }, { status: 500 });
        }

        return NextResponse.json({ features });

    } catch (err: any) {
        console.error('AI Features Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
