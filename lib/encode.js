import { unlinkSync, readFileSync } from 'node:fs';
import { extname } from 'node:path';

import { removeNewLines } from './helpers.js';

// Encode font file to data:uri and *remove* source file.
export default function encode(fontFile) {
  const dataUri = readFileSync(fontFile, 'base64'); // Convert to data:uri
  const type = extname(fontFile).substring(1);
  const fontUrl = `'data:application/x-font-${type};charset=utf-8;base64,${dataUri}'`;

  // Remove source file
  unlinkSync(fontFile);

  return fontUrl;
}

export function svg(fontFile) {
  const dataUri = removeNewLines(readFileSync(fontFile));
  const fontUrl = `'data:image/svg+xml;charset=utf8,${dataUri}'`;

  // Remove source file
  unlinkSync(fontFile);

  return fontUrl;
}
