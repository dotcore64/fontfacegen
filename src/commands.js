const which = require('which').sync;
const isLinux = require('./helpers.js').isLinux();

const FontFaceException = require('./exception.js');

const commands = {};
const check = [
  'fontforge',
];
let missing = [];

check.forEach((cmd) => {
  try {
    commands[cmd] = which(cmd);
  } catch (e) {
    missing = [...missing, cmd];
  }
});

if (missing.length) {
  const installCmd = isLinux ? 'sudo apt-get install' : 'brew install';

  throw new FontFaceException(
    'We are missing some required font packages.\n'
      + 'That can be installed with:\n'
      + `${installCmd} ${missing.join(' ')}`,
  );
}

module.exports = commands;
