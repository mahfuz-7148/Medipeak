const fs = require('fs');
const key = fs.readFileSync('./adminsdk-fbsvc-79d2f04bd7.json', 'utf8');
const base64 = Buffer.from(key).toString('base64')
console.log(base64)