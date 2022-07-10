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

export const isLinux = memoize(() => type().toLowerCase() === 'linux');

export const mkdirp = (path) => mkdirSync(path, { recursive: true });
