import { type } from 'node:os';
import { mkdirSync } from 'node:fs';

export function has(haystack, needle) {
  return haystack.includes(needle);
}

export function quote(str) {
  return `"${str}"`;
}

export function trim(buffer) {
  if (!buffer) {
    return '';
  }

  return buffer.toString().trim();
}

export function removeNewLines(buffer) {
  if (!buffer) {
    return '';
  }

  return buffer.toString().replace(/\r?\n|\r/g);
}

export function uniqueChars(subset) {
  return (typeof subset === 'string' ? [...subset] : subset)
    .filter((ch, i, chars) => chars.indexOf(ch) === i);
}

export function charToHex(ch) {
  return ch.codePointAt(0).toString(16);
}

const _isLinux = type().toLowerCase() === 'linux';

export function isLinux() {
  return _isLinux;
}

export const mkdirp = (path) => mkdirSync(path, { recursive: true });
