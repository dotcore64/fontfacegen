const os = require('os');

function has(haystack, needle) {
  return haystack.indexOf(needle) !== -1;
}

function quote(str) {
  return `"${str}"`;
}

function merge(destination, source) {
  Object.keys(source).forEach((property) => {
    if (Object.prototype.hasOwnProperty.call(source, property)) {
      destination[property] = source[property]; // eslint-disable-line no-param-reassign
    }
  });
  return destination;
}

function trim(buffer) {
  if (!buffer) {
    return '';
  }

  return buffer.toString().trim();
}

function removeNewLines(buffer) {
  if (!buffer) {
    return '';
  }

  return buffer.toString().replace(/\r?\n|\r/g);
}

function uniqueChars(subset) {
  return (typeof subset === 'string' ? subset.split('') : subset)
    .filter((ch, i, chars) => chars.indexOf(ch) === i);
}

function charToHex(ch) {
  return ch.charCodeAt(0).toString(16);
}

const _isLinux = os.type().toLowerCase() === 'linux';

function isLinux() {
  return _isLinux;
}

module.exports.has = has;
module.exports.quote = quote;
module.exports.merge = merge;
module.exports.trim = trim;
module.exports.removeNewLines = removeNewLines;
module.exports.uniqueChars = uniqueChars;
module.exports.charToHex = charToHex;
module.exports.isLinux = isLinux;
