const puppeteer = require('puppeteer-core');
(async () => {
  try {
    const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' });
    const page = await browser.newPage();
    
    await page.goto('http://localhost:3000');
    await page.waitForSelector('a[href^="/product/"]', {timeout: 5000});
    await page.click('a[href^="/product/"]');
    
    await page.waitForSelector('a[href^="/checkout/"]', {timeout: 5000});
    await page.click('a[href^="/checkout/"]');
    
    await page.waitForSelector('input[type="tel"]', {timeout: 5000});
    await page.type('input[type="tel"]', '9999999999');
    await page.click('button.btn-primary');
    
    await page.waitForSelector('.otp-box', {timeout: 5000});
    const otps = await page.$$('.otp-box');
    await otps[0].type('1');
    await otps[1].type('2');
    await otps[2].type('3');
    await otps[3].type('4');
    await page.click('button.btn-primary');
    
    await page.waitForSelector('input[placeholder="Your full name"]', {timeout: 8000});
    await page.type('input[placeholder="Your full name"]', 'Test User');
    const inputs = await page.$$('input[type="tel"]');
    await inputs[0].type('9999999999');
    await page.type('input[placeholder^="Flat "]', '123 Test St');
    await page.type('input[placeholder="Secunderabad"]', 'Test Area');
    await page.type('input[placeholder="500003"]', '500003');
    
    const btns = await page.$$('button.btn-primary');
    await btns[0].click(); // "Proceed to Checkout ->"
    
    await new Promise(r => setTimeout(r, 2000));
    const layoutDetails = await page.evaluate(() => {
      const step3 = document.getElementById('step-three');
      if (!step3) return 'NO STEP 3';
      const rect = step3.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(step3);
      
      return {
        step3HTML: step3.outerHTML.substring(0, 200),
        rect: JSON.stringify(rect),
        display: computedStyle.display,
        visibility: computedStyle.visibility,
        opacity: computedStyle.opacity
      };
    });
    
    console.log('Layout Details:', layoutDetails);
    
    await page.screenshot({path: 'debug.png', fullPage: true});

    await browser.close();
  } catch (e) {
    console.error('SCRIPT ERR:', e);
  }
})();
