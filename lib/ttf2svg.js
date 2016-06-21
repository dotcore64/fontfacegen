'use strict'; 

var execSync = require('child_process').execSync;
var quote = require('./helpers.js').quote;
var ttf2svg = require('ttf2svg');
var fs = require('fs');
var trim = require('./helpers.js').trim;

var FontFaceException = require('./exception.js');

module.exports = function(source, target) {

    try {
        var ttf = fs.readFileSync(source);
        var svg = ttf2svg(ttf);
        fs.writeFileSync(target, svg);

    } catch (e) {
        throw new FontFaceException(
            'svg conversion failed: ' + e.toString() + '\n' +
            'Your SVG file will probably not be in a working state');
    }
};
