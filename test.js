fetch('https://www.vijaysales.com/api/graphql', { 
  method: 'POST', 
  headers: { 'Content-Type': 'application/json', 'Store': 'vijay_sales' }, 
  body: JSON.stringify({ query: '{ products(filter: { sku: { eq: "225699" } }) { items { name image { url } media_gallery { url } } } }' }) 
}).then(res => res.json()).then(data => console.log(JSON.stringify(data, null, 2))).catch(e => console.error(e));
