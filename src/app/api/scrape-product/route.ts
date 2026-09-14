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

        let html: string = '';
        
        try {
            // 1. Direct fetch - prevents proxy rate limits/failures for large HTML
            const directResponse = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                },
                timeout: 10000
            });
            html = directResponse.data;
            if (typeof html !== 'string' || !html.includes('<html')) {
                throw new Error("Invalid HTML response from direct fetch");
            }
        } catch (err: any) {
            console.log(`Direct fetch failed for ${url} (${err.message}), trying AllOrigins proxy...`);
            // 2. Use AllOrigins to bypass basic CORS and simple bot blockers
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
            const response = await axios.get(proxyUrl, { timeout: 15000 });
            html = response.data.contents;
        }

        if (!html) {
            throw new Error('Failed to retrieve HTML content');
        }

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
                            const imgArray = Array.isArray(s.image) ? s.image : [s.image];
                            imgArray.forEach((img: any) => {
                                if (typeof img === 'string') productData.images.push(img);
                                else if (img && typeof img.url === 'string') productData.images.push(img.url);
                            });
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
        if (url.includes('amazon') || url.includes('amzn')) {
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
            
            // Extract multiple Amazon images from thumbnails
            $('#altImages img, .imgTagWrapper img').each((_, el) => {
                let src = $(el).attr('src');
                if (src && src.includes('images/I/')) {
                    // Convert Amazon thumbnail URL to high res URL by removing the size modifiers
                    const highRes = src.replace(/\._.*_\./, '.');
                    productData.images.push(highRes);
                }
            });

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
            
            // Extract multiple Flipkart images
            $('.q6DClP, ._2r_T1I, ._396cs4').each((_, el) => {
                let src = $(el).attr('src');
                if (!src) {
                    let style = $(el).attr('style');
                    if (style && style.includes('url(')) {
                        let matched = style.match(/url\((.*?)\)/);
                        if (matched && matched[1]) src = matched[1];
                    }
                }
                if (src && src.includes('http')) {
                    // Convert Flipkart thumbnails to high res
                    let highRes = src.replace(/\/[1-9][0-9]+\/[1-9][0-9]+\//, '/832/832/');
                    productData.images.push(highRes);
                }
            });
        }

        // Vijay Sales specific metadata & fallback
        if (url.includes('vijaysales')) {
            if (!productData.name) {
                productData.name = $('h1').first().text().trim() || $('meta[property="og:title"]').attr('content')?.split('|')[0].trim() || '';
            }
            if (productData.price === 0) {
                let priceText = $('.PriceDetails, .pdprice, span:contains("₹"), div:contains("₹"), .vsp-price').first().text() || $('meta[property="product:price:amount"]').attr('content');
                if (priceText) {
                    productData.price = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;
                }
            }
            // Extract multiple images for Vijay Sales
            $('#altImages img, .thumb-img img, .vsp-slider-image, .ProductImage img, .slick-slide img, .product-image-photo, .gallery-placeholder__image, .fotorama__img').each((_, el) => {
                const src = $(el).attr('src') || $(el).attr('data-src');
                if (src && !src.includes('placeholder')) {
                    // Try to get higher quality images by replacing query params if they exist (e.g., ?w=100 to ?w=800)
                    productData.images.push(src.replace(/\?w=[0-9]+/, '?w=800'));
                }
            });
            let imgMain = $('#imgMain').attr('src') || $('meta[property="og:image"]').attr('content');
            if (imgMain) productData.images.unshift(imgMain);
            if (!productData.brand || productData.brand === 'Unknown') {
                 // Try to glean from name
                 if(productData.name) productData.brand = productData.name.split(' ')[0].trim();
            }
        }

        // Sansui specific metadata & fallback
        if (url.includes('sansui')) {
             if (!productData.name) {
                 productData.name = $('.product_title').text().trim() || $('h1').first().text().trim() || '';
             }
             if (productData.price === 0) {
                 let priceText = $('.price .amount, .price').first().text() || $('meta[property="product:price:amount"]').attr('content');
                 if (priceText) {
                     productData.price = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;
                 }
             }
             // Extract multiple images for Sansui
             $('.woocommerce-product-gallery__image img, .product-image img, .thumbnails img, .slick-slide img').each((_, el) => {
                 let src = $(el).attr('data-src') || $(el).attr('src') || $(el).attr('data-large_image');
                 if (src && !src.includes('placeholder')) {
                     productData.images.push(src);
                 }
             });
             let sansuiMain = $('meta[property="og:image"]').attr('content');
             if (sansuiMain) productData.images.unshift(sansuiMain);
             productData.brand = 'Sansui';
        }

        // Universal meta tag fallback
        if (!productData.name) {
            productData.name = $('meta[property="og:title"]').attr('content') || $('title').text() || '';
            productData.name = productData.name.split('|')[0].trim();
        }
        if (productData.images.length === 0) {
            let metaImage = $('meta[property="og:image"]').attr('content') || $('meta[name="twitter:image"]').attr('content');
            if (metaImage) productData.images.push(metaImage);
        }

        // Generic price fallback
        if (productData.price === 0) {
            let priceText = $('meta[property="product:price:amount"]').attr('content') || 
                            $('meta[property="og:price:amount"]').attr('content') || 
                            $('[class*="price" i]').first().text() || '';
            if (!priceText) {
                // look for standard currency formats in body
                const match = $('body').text().match(/(?:₹|Rs\.?)\s*([\d,]+)/i);
                if (match) priceText = match[1];
            }
            if (priceText) {
                productData.price = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;
            }
        }

        // Cleanup
        productData.images = [...new Set(productData.images)]
            .filter(Boolean)
            .filter((img: any) => typeof img === 'string')
            .filter((img: string) => !img.includes('vs-logo'))
            .filter((img: string) => !img.includes('placeholder'))
            .filter((img: string) => !img.includes('apple-touch-icon'))
            .filter((img: string) => !img.endsWith('.svg'))
            .slice(0, 8);
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
