import { type } from 'node:os';
import { mkdirSync } from 'node:fs';

export const memoize = (fn) => {
  let res; let
    called = false;

  return (...args) => {
    if (called) {
      return res;
    }

    res = fn(...args);
    called = true;
    return res;
  };
};

export const quote = (str) => `"${str}"`;

export const trim = (buffer) => buffer?.toString().trim() ?? '';

export const removeNewLines = (buffer) => buffer?.toString().replace(/\r?\n|\r/g) ?? '';

// TODO: Require subset to be a Set from the beginning
export const uniqueChars = (subset) => [...new Set(typeof subset === 'string' ? [...subset] : subset)];

export const charToHex = (ch) => ch.codePointAt(0).toString(16);

export const isLinux = memoize(() => type().toLowerCase() === 'linux');

export const mkdirp = (path) => mkdirSync(path, { recursive: true });
