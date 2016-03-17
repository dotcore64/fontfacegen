'use strict';

var path = require('path');
var encodeFont = require('./encode.js');
var has = require('./helpers.js').has;
var css = require('./css.js');
var less = require('./less.js');
var scss = require('./scss.js');

module.exports = function(config) {
    var name, filename, weight, style, woff, woff2, ttf;

    name       = config.name;
    filename   = (config.collate)
        ? path.join(config.css_fontpath, config.basename, config.basename)
        : path.join(config.css_fontpath, config.basename);
    weight     = config.weight;
    style      = config.style;
    woff2      = '"' + filename + '.woff2"';
    woff       = '"' + filename + '.woff"';
    ttf        = '"' + filename + '.ttf"';

    if (has(config.embed, 'woff2')) {
        woff2 = encodeFont(config.woff2);
    }
    if (has(config.embed, 'woff')) {
        woff = encodeFont(config.woff);
    }
    if (has(config.embed, 'ttf')) {
        ttf = encodeFont(config.ttf);
    }
    if (config.css) {
      css(config.css, name, filename, weight, style, woff2, woff, ttf);
    }
    if (config.less) {
      less(config.less, name, filename, weight, style, woff2, woff, ttf);
    }
    if (config.scss) {
      scss(config.scss, name, filename, weight, style, woff2, woff, ttf);
    }
}