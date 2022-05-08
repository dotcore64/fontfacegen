import { readFileSync, writeFileSync } from 'node:fs';
import ttf2woff2 from 'ttf2woff2';

export default (source, target) => {
  writeFileSync(target, ttf2woff2(readFileSync(source)));
};
