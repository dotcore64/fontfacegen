'use strict';

var which = require('which').sync;
var quote = require('./helpers.js').quote;
var trim = require('./helpers.js').trim;
var execSync = require('child_process').execSync;
var FontFaceException = require('./exception.js');

var ttf2eotCommand = which('ttf2eot');

function ttf2eot(source, dest) {

    var command = [ttf2eotCommand, quote(source), '>', quote(dest)].join(' ');

    try {

      var result = execSync(command);

    } catch (e) {

        throw new FontFaceException(
            'ttf2eot command failed: ' + e.toString() + '\n' +
            'From command: ' + command + '\n' +
            trim(result) + '\n' +
            'Your EOT file will probably not be in a working state');
    }

    return result;
}

module.exports = ttf2eot;