'use strict';

var quote = require('./helpers.js').quote;
var trim = require('./helpers.js').trim;
var ttf2eot = require('ttf2eot');
var fs = require('fs');
var execSync = require('child_process').execSync;

var FontFaceException = require('./exception.js');

module.exports = function(source, dest) {

    try {
        var ttf = new Uint8Array(fs.readFileSync(source));
        var eot = new Buffer(ttf2eot(ttf).buffer);

        fs.writeFileSync(dest, eot);

    } catch (e) {

        throw new FontFaceException(
            'eot conversion failed: ' + e.toString() + '\n' +
            'Your EOT file will probably not be in a working state');
    }
};
