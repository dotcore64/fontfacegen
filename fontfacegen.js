/**
 * fontfacegen.js
 * https://github.com/agentk/fontfacegen
 *
 * Copyright 2015 Karl Bowden
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */


'use strict';

var

fs                 = require('fs'),
path               = require('path'),
mkdirp             = require('mkdirp').sync,
configure          = require('./lib/configure.js'),
ttf                = require('./lib/ttf.js'),
ttf2woff2          = require('ttf2woff2'),
ttf2eot            = require('./lib/ttf2eot.js'),
ttf2svg            = require('./lib/ttf2svg.js'),
fontforge          = require('./lib/fontforge.js'),
stylesheets        = require('./lib/stylesheets.js'),

// ----------------------------------------------------------------------------

generateFontFace = function(options) {
    var config = configure(options);

    mkdirp(config.dest_dir);
    mkdirp(path.dirname(config.css));
    mkdirp(path.dirname(config.less));
    mkdirp(path.dirname(config.scss));
    ttf(config.source, config.ttf, config.name);
    ttf2eot(config.ttf, config.eot);
    generateSvg(config);
    generateWoff(config);
    generateWoff2(config);
    stylesheets(config);
},


// ----------------------------------------------------------------------------

generateSvg = function(config) {

    var source = config.ttf,
        target = config.svg,
        name   = config.name;

    return ttf2svg(source, target, name);
},

generateWoff = function(config) {

    var script = 'Open($1);Generate($2, "", 8);',
        source = config.source,
        target = config.woff;

    return fontforge(source, script, target);
},

generateWoff2 = function(config) {

    var source = fs.readFileSync(config.ttf);

    fs.writeFileSync(config.woff2, ttf2woff2(source));
};

module.exports = generateFontFace;
