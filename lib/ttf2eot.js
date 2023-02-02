const ttf2eot = require('ttf2eot');
const fs = require('fs');

const FontFaceException = require('./exception.js');

module.exports = (source, dest) => {
  try {
    const ttf = new Uint8Array(fs.readFileSync(source));
    const eot = Buffer.from(ttf2eot(ttf).buffer);

    fs.writeFileSync(dest, eot);
  } catch (e) {
    throw new FontFaceException(
      `eot conversion failed: ${e.toString()}\n`
      + 'Your EOT file will probably not be in a working state',
    );
  }
};
