const axios = require('axios');
const metascraper = require('metascraper')([
    require('metascraper-amazon')(),
    require('metascraper-title')(),
    require('metascraper-description')(),
    require('metascraper-image')(),
    require('metascraper-url')()
]);
const cheerio = require('cheerio');

async function scrape(url) {
    console.log(`Scraping: ${url}`);
    let productData = {
        name: '',
        price: 0,
        originalPrice: 0,
        images: [],
        features: [],
        brand: ''
    };

    try {
        // We use AllOrigins to bypass basic CORS and simple bot blockers
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
        const response = await axios.get(proxyUrl, { timeout: 15000 });
        const html = response.data.contents;
        const $ = cheerio.load(html);

        // Extract metadata
        const metadata = await metascraper({ html, url });

        if (metadata.title) {
            productData.name = metadata.title.replace(/ : Amazon.*/, '').split('|')[0].trim();
        }
        if (metadata.image) {
            productData.images.push(metadata.image);
        }

        if (metadata.description && !url.includes('flipkart')) {
            // Very basic feature extraction from description
            let sentences = metadata.description.split('. ').filter(s => s.length > 10);
            if (sentences.length > 0) {
                productData.features = sentences.slice(0, 3).map(s => s.trim() + (s.endsWith('.') ? '' : '.'));
            }
        }

        // Schema extraction fallback (usually contains good data)
        const schemaScripts = $('script[type="application/ld+json"]').toArray();
        for (let el of schemaScripts) {
            try {
                const schema = JSON.parse($(el).html());

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

        // Amazon specific price fallback
        if (url.includes('amazon') && productData.price === 0) {
            let priceText = $('.a-price-whole').first().text();
            if (priceText) productData.price = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;

            let brandText = $('#bylineInfo').text() || $('.po-brand .a-span9').text();
            if (brandText) productData.brand = brandText.replace(/Visit the\s+|Store\s+/gi, '').trim();

            // Try to rescue Amazon images from alternate slots if schema fails
            if (productData.images.length === 0) {
                const landingImage = $('#landingImage').attr('src');
                if (landingImage) productData.images.push(landingImage);
            }
        }

        // Flipkart specific fallback
        if (url.includes('flipkart') && productData.price === 0) {
            let priceText = $('._30jeq3, .nxv_81, div[class*="Nx9bqj"]').first().text();
            if (priceText) productData.price = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;

            let brandText = $('.G9uJOA, .s1A96w, ._2Wk9S9').first().text();
            if (brandText) productData.brand = brandText.split(' ')[0].trim();
        }

        // Cleanup
        productData.images = [...new Set(productData.images)].filter(Boolean).slice(0, 4);
        if (productData.price > 0 && productData.originalPrice === 0) {
            productData.originalPrice = Math.floor(productData.price * 1.15); // Add fake 15% discount
        }
        if (!productData.brand) {
            productData.brand = 'Unknown';
        }

        console.log(JSON.stringify(productData, null, 2));

    } catch (err) {
        console.error("Scraping error:", err.message);
    }
}

async function run() {
    await scrape('https://www.amazon.in/Sony-Bravia-inches-Google-KD-65X74L/dp/B0BZD9BFL4');
    console.log('-----');
    await scrape('https://www.flipkart.com/panasonic-1-5-ton-3-star-split-smart-ac-wi-fi-connect-silver/p/itm5a86bc27f7112');
}

run();
