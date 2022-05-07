import { execSync } from 'node:child_process';
import which from 'which';

import { isLinux } from './helpers.js';
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

function FontForgeException(e, cmd) {
  this.message = `FontForge command failed: ${e.toString()}\n`
    + `From command: ${cmd}`;
  this.name = 'FontForgeException';
}

let ensured = false;
function ensureFontForge() {
  if (!ensured) {
    try {
      which.sync(FONTFORGE);
    } catch (e) {
      const installCmd = isLinux() ? 'sudo apt-get install' : 'brew install';

      throw new FontFaceException(
        'We are missing some required font packages.\n'
      + 'That can be installed with:\n'
      + `${installCmd} ${FONTFORGE}`,
      );
    }

    ensured = true;
  }
}

export default function fontforge(source, script, target, name) {
  ensureFontForge();

  let cmd = `${FONTFORGE} -lang=ff -c '${script}' '${source}'`;

  if (target !== undefined) {
    cmd += ` '${target}'`;
  }

  if (name !== undefined) {
    cmd += ` '${name}'`;
  }

  let result;

  try {
    result = execSync(cmd, { stdio: ['pipe', 'pipe', process.stderr] }).toString();
  } catch (e) {
    throw new FontForgeException(e, cmd);
  }

  return result;
}

export function getName(source) {
  const result = fontforge(source, 'Open($1);Print($fontname);');
  if (result) {
    return result.trim().replace(' ', '_');
  }
  return false;
}

export function getWeight(source) {
  const result = fontforge(source, 'Open($1);Print($weight);');
  if (result) {
    const weight = result.trim().replace(' ', '').toLowerCase();
    if (weightTable[weight]) {
      return weightTable[weight];
    }
    return weight;
  }
  return false;
}

export function getStyle(source) {
  const result = fontforge(source, 'Open($1);Print($italicangle);');
  if (result) {
    return (parseInt(result.trim(), 10) === 0) ? 'normal' : 'italic';
  }
  return false;
}
