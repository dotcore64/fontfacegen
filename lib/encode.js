const fs = require('fs');
const path = require('path');

const { removeNewLines } = require('./helpers.js');

// Encode font file to data:uri and *remove* source file.
function encode(fontFile) {
  const dataUri = fs.readFileSync(fontFile, 'base64'); // Convert to data:uri
  const type = path.extname(fontFile).substring(1);
  const fontUrl = `'data:application/x-font-${type};charset=utf-8;base64,${dataUri}'`;

  // Remove source file
  fs.unlinkSync(fontFile);

  return fontUrl;
}

function svg(fontFile) {
  const dataUri = removeNewLines(fs.readFileSync(fontFile));
  const fontUrl = `'data:image/svg+xml;charset=utf8,${dataUri}'`;

  // Remove source file
  fs.unlinkSync(fontFile);

  return fontUrl;
}

module.exports = encode;
module.exports.svg = svg;
