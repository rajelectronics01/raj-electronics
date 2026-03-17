const fs = require('fs');
const pdf = require('pdf-parse');
let dataBuffer = fs.readFileSync('policies.pdf');
pdf(dataBuffer).then(function(data) {
  fs.writeFileSync('policies.txt', data.text);
}).catch(err => console.error(err));
