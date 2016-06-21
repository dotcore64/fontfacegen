'use strict';

var which = require('which').sync;
var exec = require('child_process').execSync;
var isLinux = require('./helpers.js').isLinux();

var FontFaceException = require('./exception.js');

var commands = {};
var done = false;

module.exports = function() {

    if (done) {
      return commands;
    }
    done = true;

    var check = {
      fontforge: {}
    };

    var missing = [];

    for (var cmd in check) {
        if (check.hasOwnProperty(cmd)) {
            try {
                commands[cmd] = which(cmd);
            } catch(e) {
                missing.push(cmd);
            }
        }
    }

    if (missing.length) {
        var installCmd = isLinux ? 'sudo apt-get install' : 'brew install';

        throw new FontFaceException(
            'We are missing some required font packages.\n' +
            'That can be installed with:\n' +
            installCmd + ' ' + missing.join(' '));
    }

    return commands;
}()
