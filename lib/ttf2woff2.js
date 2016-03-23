'use strict';

var fs = require('fs');
var ttf2woff2 = require('ttf2woff2');

module.exports = function(source, target) {
    fs.writeFileSync(target, ttf2woff2(fs.readFileSync(source)));
};
