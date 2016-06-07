'use strict';

var

path               = require('path'),
mkdirp             = require('mkdirp').sync,
configure          = require('./configure.js'),
ttf                = require('./ttf.js'),
ttf2woff           = require('./ttf2woff.js'),
ttf2woff2          = require('./ttf2woff2.js'),
ttf2eot            = require('./ttf2eot.js'),
ttf2svg            = require('./ttf2svg.js'),
stylesheets        = require('./stylesheets.js');

module.exports = function(options) {
    var config = configure(options);

    mkdirp(config.dest_dir);

    if (config.css) {
        mkdirp(path.dirname(config.css));
    }

    if (config.less) {
        mkdirp(path.dirname(config.less));
    }

    if (config.scss) {
        mkdirp(path.dirname(config.scss));   
    }

    ttf(config.source, config.ttf, config.name);
    ttf2eot(config.ttf, config.eot);
    ttf2svg(config.ttf, config.svg, config.name);
    ttf2woff(config.ttf, config.woff);
    ttf2woff2(config.ttf, config.woff2);
    stylesheets(config);
};
