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
        // Rotate User Agents
        const userAgents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
        ];
        const randomUA = userAgents[Math.floor(Math.random() * userAgents.length)];

        let data = '';

        try {
            // Attempt 1: Standard fetch with fake browser headers
            const response = await axios.get(url, {
                headers: {
                    'User-Agent': randomUA,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                    'Accept-Language': 'en-IN,en-US;q=0.9,en;q=0.8',
                    'DNT': '1',
                    'Upgrade-Insecure-Requests': '1',
                    'Sec-Fetch-Site': 'none',
                    'Sec-Fetch-Mode': 'navigate',
                    'Sec-Fetch-User': '?1',
                    'Sec-Fetch-Dest': 'document'
                },
                timeout: 10000,
            });
            data = response.data;
        } catch (initialError: any) {
            console.log(`Direct fetch failed. Using CORS proxy fallback...`);
            // Attempt 2: Use AllOrigins Proxy
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
            const proxyResponse = await axios.get(proxyUrl, { timeout: 15000 });
            data = proxyResponse.data.contents;
        }

        const $ = cheerio.load(data);

        // Anti-bot detection
        if (data.includes('api-services-support@amazon.com') || $('title').text().includes('Robot Check') || data.includes('To discuss automated access')) {
            throw new Error("Target site returned a CAPTCHA. Scraping blocked.");
        }

        let productData: any = {
            name: '',
            price: 0,
            originalPrice: 0,
            images: [],
            features: [],
            brand: ''
        };

        if (url.includes('amazon')) {
            // Try standard DOM first
            productData.name = $('#productTitle').text().trim() || $('meta[name="title"]').attr('content')?.replace(' : Amazon.in', '');

            // Price extraction
            let priceText = $('.a-price .a-offscreen').first().text() || $('.a-price-whole').first().text();
            if (priceText) {
                productData.price = parseInt(priceText.split('.')[0].replace(/[^0-9]/g, '')) || 0;
            }

            let originalPriceText = $('.a-text-price .a-offscreen').first().text();
            if (originalPriceText) {
                productData.originalPrice = parseInt(originalPriceText.split('.')[0].replace(/[^0-9]/g, '')) || 0;
            }

            // Brand
            productData.brand = $('#bylineInfo').text().replace(/Visit the\s+|Store\s+/gi, '').trim() ||
                $('.po-brand .a-span9').text().trim();

            // Images
            const landingImage = $('#landingImage').attr('src') || $('#main-image').attr('src');
            if (landingImage) productData.images.push(landingImage);

            const dynamicImageMap = $('#landingImage').attr('data-a-dynamic-image');
            if (dynamicImageMap) {
                try {
                    const images = JSON.parse(dynamicImageMap);
                    const highRes = Object.keys(images).sort((a, b) => images[b][0] - images[a][0])[0];
                    if (highRes && !productData.images.includes(highRes)) productData.images.unshift(highRes);
                } catch (e) { }
            }

            $('#altImages ul li img').each((_, el) => {
                let src = $(el).attr('src');
                if (src && src.includes('I/')) {
                    src = src.replace(/\._[A-Za-z0-9_]+_\./, '.');
                    if (!productData.images.includes(src)) productData.images.push(src);
                }
            });

            // Features
            $('#feature-bullets li span.a-list-item').each((_, el) => {
                const text = $(el).text().trim();
                if (text && !text.toLowerCase().includes('click here')) productData.features.push(text);
            });

        } else if (url.includes('flipkart')) {
            // Flipkart uses multiple classes randomly. Best to try multiple.
            productData.name = $('.B_NuCI').text().trim() || $('.yhB1nd span').text().trim() || $('h1 span').text().trim() || $('meta[name="twitter:title"]').attr('content');

            const priceText = $('._30jeq3').first().text() || $('.nxv_81').first().text() || $('div[class*="Nx9bqj"]').first().text();
            if (priceText) {
                productData.price = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;
            }

            const originalPriceText = $('._3I9_wc').first().text() || $('.y_UxS4').first().text() || $('div[class*="yRaY8j"]').first().text();
            if (originalPriceText) {
                productData.originalPrice = parseInt(originalPriceText.replace(/[^0-9]/g, '')) || 0;
            }

            productData.brand = $('.G9uJOA').first().text().trim() || $('.s1A96w').text().trim() || $('._2Wk9S9').text().trim();
            if (productData.brand && productData.brand.includes(' ')) {
                productData.brand = productData.brand.split(' ')[0]; // Extract first word
            }

            const image = $('._396cs4').first().attr('src') || $('img.DByuf4').attr('src') || $('img[class*="v2Vakm"]').attr('src');
            if (image) {
                productData.images.push(image.replace(/\/[0-9]+\/[0-9]+\//, '/832/832/'));
            }

            // Extract Flipkart features
            $('._21Ahn-, ._1mXcCf, ul li[class*="rgFiE"]').each((_, el) => {
                const text = $(el).text().trim();
                if (text) productData.features.push(text);
            });

        }

        // UNIVERSAL BRAND SITE FALLBACK SCRAPING
        if (!productData.name) {
            console.log("Using universal scraper / Schema fallback");
            productData.name = $('meta[property="og:title"]').attr('content') || $('title').text().trim();
            // Clean up brand name trailing pipes/dashes
            productData.name = productData.name.split('|')[0].split('-')[0].trim();

            const schemaScript = $('script[type="application/ld+json"]').first().html();
            if (schemaScript) {
                try {
                    const schema = JSON.parse(schemaScript);
                    if (schema.image) productData.images.push(Array.isArray(schema.image) ? schema.image[0] : schema.image);
                    if (schema.brand?.name) productData.brand = schema.brand.name;
                    if (schema.offers?.price) productData.price = parseInt(schema.offers.price);
                } catch (e) { }
            }

            // Fallback Images
            if (productData.images.length === 0) {
                productData.images.push($('meta[property="og:image"]').attr('content'));
            }

            // Fallback Price
            if (productData.price === 0) {
                const bodyText = $('body').text().replace(/\s+/g, ' ');
                const priceMatch = bodyText.match(/(?:₹|Rs\.?|MRP)\s*(([0-9]{1,2},)?[0-9]{2,3},[0-9]{3}|[0-9]{4,6})/i);
                if (priceMatch && priceMatch[1]) {
                    productData.price = parseInt(priceMatch[1].replace(/[^0-9]/g, '')) || 0;
                }
            }
        }

        // Failsafe calculations & cleanup
        if (productData.price > 0 && productData.originalPrice === 0) {
            productData.originalPrice = Math.floor(productData.price * 1.1);
        }
        productData.images = productData.images.filter(Boolean).slice(0, 4);
        productData.features = productData.features.slice(0, 5);
        if (!productData.brand) {
            productData.brand = "Unknown";
        }

        console.log('Scraped Data:', productData);
        return NextResponse.json(productData);

    } catch (error: any) {
        console.error('Scraping error:', error.message);
        return NextResponse.json({ error: 'Failed to fetch product data: ' + error.message }, { status: 500 });
    }
}
