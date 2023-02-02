const ttf2svg = require('ttf2svg');
const fs = require('fs');

const FontFaceException = require('./exception.js');

module.exports = (source, target) => {
  try {
    const ttf = fs.readFileSync(source);
    const svg = ttf2svg(ttf);
    fs.writeFileSync(target, svg);
  } catch (e) {
    throw new FontFaceException(
      `svg conversion failed: ${e.toString()}\n`
      + 'Your SVG file will probably not be in a working state',
    );
  }
};
