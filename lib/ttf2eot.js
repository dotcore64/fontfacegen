'use strict';

var quote = require('./helpers.js').quote;
var trim = require('./helpers.js').trim;
var execSync = require('child_process').execSync;

var FontFaceException = require('./exception.js');

var ttf2eotCommand = require('./commands.js').ttf2eot;

module.exports = function(source, dest) {

    var command = [ttf2eotCommand, quote(source), '>', quote(dest)].join(' ');

    try {

        var result = execSync(command).toString();

    } catch (e) {

        throw new FontFaceException(
            'ttf2eot command failed: ' + e.toString() + '\n' +
            'From command: ' + command + '\n' +
            trim(result) + '\n' +
            'Your EOT file will probably not be in a working state');
    }

    return result;
};
