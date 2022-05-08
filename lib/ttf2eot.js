import { readFileSync, writeFileSync } from 'node:fs';
import { Buffer } from 'node:buffer';
import ttf2eot from 'ttf2eot';

import FontFaceException from './exception.js';

export default (source, dest) => {
  try {
    const ttf = new Uint8Array(readFileSync(source));
    const eot = Buffer.from(ttf2eot(ttf).buffer);

    writeFileSync(dest, eot);
  } catch (e) {
    throw new FontFaceException(
      `eot conversion failed: ${e.toString()}\n`
      + 'Your EOT file will probably not be in a working state',
    );
  }
};
