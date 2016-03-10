'use strict'; 

var execSync = require('child_process').execSync;
var quote = require('./helpers.js').quote;
var trim = require('./helpers.js').trim;
var isLinux = require('./helpers.js').isLinux();

var ttf2svgCommand = require('./commands.js').ttf2svg;

module.exports = function(source, target, name) {

    var command = '';

    if (isLinux) {
        command = [ttf2svgCommand, quote(source), '>', quote(target)].join(' ');
    } else{
        command = [ttf2svgCommand, quote(source), '-id', quote(name), '-o', quote(target)].join(' ');
    }
    
    try {
        var result = execSync(command);


    } catch (e) {
        throw new FontFaceException(
            'ttf2svg command failed\n' +
            'From command: ' + command + '\n' +
            trim(result) + '\n' +
            'Your SVG file will probably not be in a working state');
        
    }

    return result;
};
