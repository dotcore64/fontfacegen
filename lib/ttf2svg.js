import { readFileSync, writeFileSync } from 'node:fs';
import ttf2svg from 'ttf2svg';

import FontFaceException from './exception.js';

export default (source, target) => {
  try {
    const ttf = readFileSync(source);
    const svg = ttf2svg(ttf);
    writeFileSync(target, svg);
  } catch (error) {
    throw new FontFaceException(
      `svg conversion failed: ${error.toString()}\n`
      + 'Your SVG file will probably not be in a working state',
    );
  }
};
