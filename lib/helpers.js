'use strict';

var os = require('os');

function has(haystack, needle) {
    return haystack.indexOf(needle) !== -1;
}

function quote(str) {
    return '"' + str + '"';
}

function merge(destination, source) {
    for (var property in source) {
        if (source.hasOwnProperty(property)) {
            destination[property] = source[property];
        }
    }
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

var _isLinux = os.type().toLowerCase() == "linux";

function isLinux() {
  return _isLinux;
}

module.exports.has = has;
module.exports.quote = quote;
module.exports.merge = merge;
module.exports.trim = trim;
module.exports.removeNewLines = removeNewLines;
module.exports.isLinux = isLinux;
