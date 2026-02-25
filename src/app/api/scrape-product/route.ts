import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    try {
        console.log(`Scraping URL: ${url}`);
        let productData: any = {
            name: '',
            price: 0,
            originalPrice: 0,
            images: [],
            features: [],
            brand: ''
        };

        // We use AllOrigins to bypass basic CORS and simple bot blockers
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
        const response = await axios.get(proxyUrl, { timeout: 15000 });
        const html = response.data.contents;
        const $ = cheerio.load(html);

        // Schema extraction fallback (usually contains good data)
        const schemaScripts = $('script[type="application/ld+json"]').toArray();
        for (let el of schemaScripts) {
            try {
                const text = $(el).html();
                if (!text) continue;
                const schema = JSON.parse(text);

                // If it's an array of schemas, find the product one
                const schemas = Array.isArray(schema) ? schema : [schema];

                for (let s of schemas) {
                    if (s['@type'] === 'Product' || s['@type'] === 'ItemPage') {
                        if (!productData.name && s.name) productData.name = s.name;
                        if (s.image) {
                            let img = Array.isArray(s.image) ? s.image[0] : s.image;
                            if (typeof img === 'string') productData.images.push(img);
                        }
                        if (s.brand?.name) productData.brand = s.brand.name;

                        // Price logic
                        if (s.offers) {
                            const offer = Array.isArray(s.offers) ? s.offers[0] : s.offers;
                            if (offer.price) productData.price = parseInt(offer.price);
                        }
                    }
                }
            } catch (e) { }
        }

        // Amazon specific metadata & fallback
        if (url.includes('amazon')) {
            if (!productData.name) {
                productData.name = $('#productTitle').text().trim() || $('meta[name="title"]').attr('content')?.replace(/ : Amazon.*/, '').split('|')[0].trim() || '';
            }

            if (productData.price === 0) {
                let priceText = $('.a-price-whole').first().text();
                if (priceText) productData.price = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;
            }

            if (!productData.brand || productData.brand === 'Unknown') {
                let brandText = $('#bylineInfo').text() || $('.po-brand .a-span9').text();
                if (brandText) productData.brand = brandText.replace(/Visit the\s+|Store\s+/gi, '').trim();
            }

            if (productData.images.length === 0) {
                const landingImage = $('#landingImage').attr('src');
                if (landingImage) productData.images.push(landingImage);
            }

            // Extract Amazon specific features
            $('#feature-bullets li span.a-list-item').each((_, el) => {
                const text = $(el).text().trim();
                if (text && !text.toLowerCase().includes('click here')) productData.features.push(text);
            });
        }

        // Flipkart specific metadata & fallback
        if (url.includes('flipkart')) {
            if (!productData.name) {
                productData.name = $('.B_NuCI').text().trim() || $('.yhB1nd span').text().trim() || $('h1 span').text().trim() || $('meta[name="twitter:title"]').attr('content') || '';
            }

            if (productData.price === 0) {
                let priceText = $('._30jeq3, .nxv_81, div[class*="Nx9bqj"]').first().text();
                if (priceText) productData.price = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;
            }

            if (!productData.brand || productData.brand === 'Unknown') {
                let brandText = $('.G9uJOA, .s1A96w, ._2Wk9S9').first().text();
                if (brandText) productData.brand = brandText.split(' ')[0].trim();
            }

            // Extract Flipkart features (often under specific UL classes)
            $('._21Ahn-, ._1mXcCf, ul li[class*="rgFiE"]').each((_, el) => {
                const text = $(el).text().trim();
                if (text) productData.features.push(text);
            });
        }

        // Universal meta tag fallback
        if (!productData.name) {
            productData.name = $('meta[property="og:title"]').attr('content') || $('title').text() || '';
            productData.name = productData.name.split('|')[0].trim();
        }
        if (productData.images.length === 0) {
            let metaImage = $('meta[property="og:image"]').attr('content');
            if (metaImage) productData.images.push(metaImage);
        }

        // Cleanup
        productData.images = [...new Set(productData.images)].filter(Boolean).slice(0, 4);
        if (productData.price > 0 && productData.originalPrice === 0) {
            productData.originalPrice = Math.floor(productData.price * 1.15); // Add fake 15% discount
        }
        if (!productData.brand) {
            productData.brand = 'Unknown';
        }

        console.log('Scraped Data:', productData);
        return NextResponse.json(productData);

    } catch (error: any) {
        console.error('Scraping error:', error.message);
        return NextResponse.json({ error: 'Failed to fetch product data: ' + error.message }, { status: 500 });
    }
}
