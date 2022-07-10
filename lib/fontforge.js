import { execSync } from 'node:child_process';
import which from 'which';

import { memoize, isLinux } from './helpers.js';
import FontFaceException from './exception.js';

const FONTFORGE = 'fontforge';

const weightTable = {
  thin: '100',
  extralight: '200',
  book: '300',
  light: '300',
  medium: 'normal',
  normal: 'normal',
  demibold: '600',
  semibold: '700',
  bold: '700',
  extrabold: '800',
  black: '900',
};

class FontForgeException extends Error {
  name = 'FontForgeException';

  constructor(e, cmd) {
    super(`FontForge command failed: ${e.toString()}\n`
      + `From command: ${cmd}`);
  }
}

const ensureFontForge = memoize(() => {
  try {
    which.sync(FONTFORGE);
  } catch {
    const installCmd = isLinux() ? 'sudo apt-get install' : 'brew install';

    throw new FontFaceException(
      'We are missing some required font packages.\n'
        + 'That can be installed with:\n'
        + `${installCmd} ${FONTFORGE}`,
    );
  }
});

export default function fontforge(source, script, target, name) {
  ensureFontForge();

  const cmd = `${FONTFORGE} -lang=ff -c '${script}' '${source}'${target !== undefined ? ` '${target}'` : ''}${name !== undefined ? ` '${name}'` : ''}`;

  try {
    return execSync(cmd, { stdio: ['pipe', 'pipe', process.stderr] }).toString();
  } catch (error) {
    throw new FontForgeException(error, cmd);
  }
}

export function getName(source) {
  return fontforge(source, 'Open($1);Print($fontname);')?.trim().replace(' ', '_') ?? false;
}

export function getWeight(source) {
  const result = fontforge(source, 'Open($1);Print($weight);');
  if (result) {
    const weight = result.trim().replace(' ', '').toLowerCase();

    return weightTable[weight] ?? weight;
  }
  return false;
}

export function getStyle(source) {
  const result = fontforge(source, 'Open($1);Print($italicangle);');
  if (result) {
    return (Number.parseInt(result.trim(), 10) === 0) ? 'normal' : 'italic';
  }
  return false;
}
