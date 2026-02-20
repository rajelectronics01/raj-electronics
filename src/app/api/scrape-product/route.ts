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
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
            },
        });

        console.log(`Fetched data length: ${data.length}`);

        const $ = cheerio.load(data);
        let productData: any = {
            name: '',
            price: 0,
            originalPrice: 0,
            images: [],
            features: [],
        };

        if (url.includes('amazon')) {
            productData.name = $('#productTitle').text().trim();

            // Try multiple price selectors
            let priceText = $('.a-price .a-offscreen').first().text();
            if (!priceText) priceText = $('.a-price-whole').first().text();

            productData.price = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;

            const originalPriceText = $('.a-text-price .a-offscreen').first().text();
            productData.originalPrice = parseInt(originalPriceText.replace(/[^0-9]/g, '')) || 0;

            // Image extraction
            const landingImage = $('#landingImage').attr('src');
            if (landingImage) productData.images.push(landingImage);

            // Fallback image extraction
            if (productData.images.length === 0) {
                const dynamicImage = $('#imgTagWrapperId img').attr('src');
                if (dynamicImage) productData.images.push(dynamicImage);
            }

            // Features
            $('#feature-bullets li span.a-list-item').each((_, el) => {
                const text = $(el).text().trim();
                if (text) productData.features.push(text);
            });

        } else if (url.includes('flipkart')) {
            productData.name = $('.B_NuCI').text().trim() || $('.yhB1nd span').text().trim() || $('h1 span').text().trim();

            const priceText = $('._30jeq3').first().text();
            productData.price = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;

            const originalPriceText = $('._3I9_wc').first().text();
            productData.originalPrice = parseInt(originalPriceText.replace(/[^0-9]/g, '')) || 0;

            const image = $('._396cs4').first().attr('src') || $('img.DByuf4').attr('src');
            if (image) productData.images.push(image);

            $('._21Ahn-').each((_, el) => {
                const text = $(el).text().trim();
                if (text) productData.features.push(text);
            });

            // Fallback features for Flipkart
            if (productData.features.length === 0) {
                $('._1mXcCf').each((_, el) => {
                    const text = $(el).text().trim();
                    if (text) productData.features.push(text);
                });
            }
        }

        // Clean up data
        productData.features = productData.features.slice(0, 5); // Limit features

        console.log('Scraped Data:', productData);

        if (!productData.name) {
            console.log('Warning: No product name found. Selectors might be outdated or page content is dynamic/captcha.');
        }

        return NextResponse.json(productData);

    } catch (error: any) {
        console.error('Scraping error:', error.message);
        if (error.response) {
            console.error('Error status:', error.response.status);
            console.error('Error headers:', error.response.headers);
        }
        return NextResponse.json({ error: 'Failed to fetch product data. The site might be blocking the request (' + error.message + ').' }, { status: 500 });
    }
}
