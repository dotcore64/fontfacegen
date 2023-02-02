const fs = require('fs');
const ttf2woff2 = require('ttf2woff2');

module.exports = (source, target) => {
  fs.writeFileSync(target, ttf2woff2(fs.readFileSync(source)));
};
