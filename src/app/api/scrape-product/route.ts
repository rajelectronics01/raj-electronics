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
        // Generate a slightly randomized user agent to avoid static fingerprinting
        const userAgents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        ];
        const randomUA = userAgents[Math.floor(Math.random() * userAgents.length)];

        let data = '';

        try {
            // First attempt: Direct fetch with spoofed headers
            const response = await axios.get(url, {
                headers: {
                    'User-Agent': randomUA,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                    'Accept-Language': 'en-IN,en-US;q=0.9,en;q=0.8',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Cache-Control': 'max-age=0',
                    'Sec-Ch-Ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
                    'Sec-Ch-Ua-Mobile': '?0',
                    'Sec-Ch-Ua-Platform': '"Windows"',
                    'Sec-Fetch-Dest': 'document',
                    'Sec-Fetch-Mode': 'navigate',
                    'Sec-Fetch-Site': 'none',
                    'Sec-Fetch-User': '?1',
                    'Upgrade-Insecure-Requests': '1',
                    'Connection': 'keep-alive',
                    'Pragma': 'no-cache'
                },
                timeout: 15000,
            });
            data = response.data;
        } catch (initialError: any) {
            console.log(`Direct fetch failed (${initialError.response?.status || initialError.message}). Attempting proxy fallback...`);

            // Second attempt: Fallback to an open-source proxy to bypass WAF/Cloudflare
            // We use corsproxy.io which often bypasses basic geographic/bot blocks
            const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
            const proxyResponse = await axios.get(proxyUrl, {
                headers: { 'User-Agent': randomUA },
                timeout: 20000
            });
            data = proxyResponse.data;
        }

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

            // Try to extract more Amazon thumbnail images and convert them to high-res
            $('#altImages ul li img').each((_, el) => {
                let src = $(el).attr('src');
                if (src && src.includes('I/')) {
                    // Amazon thumbnails have size markers like ._SS40_. Make them high res
                    src = src.replace(/\._[A-Za-z0-9_]+_\./, '.');
                    if (!productData.images.includes(src)) {
                        productData.images.push(src);
                    }
                }
            });

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

            // Extract more Flipkart image thumbnails and up-res them
            $('ul.undefined li img, ._2r_T1I').each((_, el) => {
                let src = $(el).attr('src');
                if (src) {
                    // Flipkart format: replace thumbnail dimensions with 832/832
                    src = src.replace(/\/[0-9]+\/[0-9]+\//, '/832/832/');
                    if (src.includes('http') && !productData.images.includes(src)) {
                        productData.images.push(src);
                    }
                }
            });

            $('._21Ahn-').each((_, el) => {
                const text = $(el).text().trim();
                if (text) productData.features.push(text);
            });

            // Fallback features for Flipkart
            // Fallback features for Flipkart
            if (productData.features.length === 0) {
                $('._1mXcCf').each((_, el) => {
                    const text = $(el).text().trim();
                    if (text) productData.features.push(text);
                });
            }
        } else {
            console.log('Using universal brand site scraper (OpenGraph / Schema fallback)');
            // UNIVERSAL BRAND SITE FALLBACK SCRAPING

            // 1. Name Strategy: Meta Title -> OG Title -> H1
            productData.name =
                $('meta[property="og:title"]').attr('content') ||
                $('meta[name="twitter:title"]').attr('content') ||
                $('title').text().trim() ||
                $('h1').first().text().trim();

            // Clean up brand name trailing pipes/dashes (e.g. "Product Name | Samsung India")
            productData.name = productData.name.split('|')[0].split('-')[0].trim();

            // 2. Image Strategy: OG Image -> Schema Image -> First large image
            productData.images.push(
                $('meta[property="og:image"]').attr('content') ||
                $('meta[name="twitter:image"]').attr('content')
            );

            if (!productData.images[0]) {
                const schemaScript = $('script[type="application/ld+json"]').html();
                if (schemaScript) {
                    try {
                        const schema = JSON.parse(schemaScript);
                        if (schema.image) productData.images.push(Array.isArray(schema.image) ? schema.image[0] : schema.image);
                    } catch (e) { /* ignore schema parse errors */ }
                }
            }

            // Filter out empty images
            productData.images = productData.images.filter(Boolean);

            // Try to scrape extra large images from the generic page explicitly
            $('img').each((_, el) => {
                const src = $(el).attr('src');
                if (src && src.startsWith('http') && !src.includes('logo') && !src.includes('icon') && !src.includes('banner')) {
                    // Look for indicators of a high-quality product image or rely on natural sizes
                    if (src.includes('product') || src.includes('large') || src.includes('gallery')) {
                        if (!productData.images.includes(src)) productData.images.push(src);
                    }
                }
            });

            // 3. Description/Features Strategy: OG Description -> Meta Description
            const description =
                $('meta[property="og:description"]').attr('content') ||
                $('meta[name="description"]').attr('content');

            if (description) {
                // Split standard descriptions by sentences for "features" list
                const sentences = description.split(/(?<=[.!?])\s+/).filter(s => s.length > 10);
                productData.features = sentences;
            }

            // 4. Price Strategy: Standard E-Commerce Metas -> Regex scraping the body
            let rawPrice =
                $('meta[property="product:price:amount"]').attr('content') ||
                $('meta[itemprop="price"]').attr('content');

            if (rawPrice) {
                productData.price = parseInt(rawPrice.replace(/[^0-9]/g, '')) || 0;
            } else {
                // Aggressive fallback: Regex search the visible body text for Indian Rupee formats
                // Looks for ₹12,999 or Rs. 12,999 or MRP: 12999
                const bodyText = $('body').text().replace(/\s+/g, ' ');
                const priceMatch = bodyText.match(/(?:₹|Rs\.?|MRP)\s*(([0-9]{1,2},)?[0-9]{2,3},[0-9]{3}|[0-9]{4,6})/i);

                if (priceMatch && priceMatch[1]) {
                    productData.price = parseInt(priceMatch[1].replace(/[^0-9]/g, '')) || 0;
                }
            }

            // Assume 10% markup for original price if none found to satisfy schema
            if (productData.price > 0 && productData.originalPrice === 0) {
                productData.originalPrice = Math.floor(productData.price * 1.1);
            }
        }

        // Clean up data
        productData.features = productData.features.slice(0, 5); // Limit features
        productData.images = productData.images.slice(0, 4); // Limit images to max 4

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
