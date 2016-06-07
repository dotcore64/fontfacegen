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
      fontforge: {},
      ttf2eot: {}
    };

    if (isLinux) {
        check.ttf2svg = {};
    } else {
        check['batik-ttf2svg'] = {};
    }

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
        if (isLinux) {
            var errNPM = [], errAPT = [];
            missing.forEach(function(cmd){
                if (cmd.indexOf("ttf2") != -1) {
                    errNPM.push(cmd);
                } else{
                    errAPT.push(cmd);
                }
            });

            throw new FontFaceException(
                'We are missing some required font packages.\n' +
                'That can be installed with:\n' +
                (errAPT.length ? 'sudo apt-get install  ' + errAPT.join(' ') + '\n' : '') +
                (errAPT.length && errNPM.length ? 'and' : '') +
                (errNPM.length ? 'sudo npm install -g  ' + errNPM.join(' ') : ''));
        } else {
            throw new FontFaceException(
                'We are missing some required font packages.\n' +
                'That can be installed with:\n' +
                  'brew install ' + missing.join(' '));
        }
    }

    return commands;
}()
