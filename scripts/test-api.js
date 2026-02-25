const { SignJWT } = require('jose');

const secret = new TextEncoder().encode('super_secret_local_testing_key_12345');

async function run() {
    try {
        const token = await new SignJWT({ username: 'rajadmin' })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('2h')
            .sign(secret);

        console.log("Fetching Apple iPhone 14 from Amazon API...");
        const res1 = await fetch('http://localhost:3000/api/scrape-product?url=https://www.amazon.in/dp/B0BDHX8Z63', {
            headers: {
                Cookie: `admin-token=${token}`
            }
        });
        console.log("Status:", res1.status);
        console.log(await res1.json());
    } catch (err) {
        console.error("Error:", err);
    }
}

run();
