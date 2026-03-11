const axios = require('axios');
const cheerio = require('cheerio');

async function test(url) {
    let html = '';
    const directResponse = await axios.get(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        },
        timeout: 10000
    }).catch(e => {
        return axios.get(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`).then(r => ({ data: r.data.contents }));
    });
    html = directResponse.data;

    const $ = cheerio.load(html);
    const images = [];

    // Sansui
    if (url.includes('sansui')) {
        $('.woocommerce-product-gallery__image img').each((i, el) => {
            let src = $(el).attr('data-src') || $(el).attr('src');
            if (src) images.push(src);
        });
    }

    // Vijay Sales
    if (url.includes('vijaysales')) {
        $('.slick-slide img, #altImages img, .thumb-img img, .vsp-slider-image').each((i, el) => {
            let src = $(el).attr('data-src') || $(el).attr('src');
            if (src && !src.includes('placeholder')) images.push(src.replace('?w=100', '?w=800'));
        });
        
        let mainImg = $('#imgMain').attr('src');
        if (mainImg) images.unshift(mainImg);
    }

    console.log([...new Set(images)]);
}

test('https://www.vijaysales.com/apple-iphone-15-pro-max-256-gb-blue-titanium/24430');
test('https://sansuiworld.com/product/sansui-55-inch-4k-uhd-smart-tv/');
