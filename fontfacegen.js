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
ttf2woff2          = require('ttf2woff2'),
ttf2eot            = require('./lib/ttf2eot.js'),
ttf2svg            = require('./lib/ttf2svg.js'),
has                = require('./lib/helpers.js').has,
quote              = require('./lib/helpers.js').quote,
merge              = require('./lib/helpers.js').merge,
isLinux            = require('./lib/helpers.js').isLinux(),
fontforge          = require('./lib/fontforge.js'),
stylesheets        = require('./lib/stylesheets.js'),

// ----------------------------------------------------------------------------

generateFontFace = function(options) {
    var config = generateConfig(options);

    mkdirp(config.dest_dir);
    mkdirp(path.dirname(config.css));
    mkdirp(path.dirname(config.less));
    mkdirp(path.dirname(config.scss));
    generateTtf(config);
    generateEot(config);
    generateSvg(config);
    generateWoff(config);
    generateWoff2(config);
    stylesheets(config);
},


// ----------------------------------------------------------------------------

generateConfig = function(options) {
    var _ = {
        source   : options.source,
        dest_dir : options.dest,
        collate  : options.collate || false
    };

    _.extension    = path.extname(_.source);
    _.basename     = path.basename(_.source, _.extension);
    _.dest_dir     = _.collate ? path.join(_.dest_dir, _.basename) : _.dest_dir;
    _.target       = path.join(_.dest_dir, _.basename);
    _.config_file  = _.source.replace(_.extension, '') + '.json';
    _.ttf          = [_.target, '.ttf'].join('');
    _.eot          = [_.target, '.eot'].join('');
    _.svg          = [_.target, '.svg'].join('');
    _.woff         = [_.target, '.woff'].join('');
    _.woff2        = [_.target, '.woff2'].join('');
    _.css          = [_.target, '.css'].join('');
    _.css_fontpath = '';
    _.name         = fontforge.getName(_.source);
    _.weight       = fontforge.getWeight(_.source);
    _.style        = fontforge.getStyle(_.source);
    _.embed        = [];

    if (fs.existsSync(_.config_file)) {
        merge(_, JSON.parse(fs.readFileSync(_.config_file)));
    }

    merge(_, options);

    return _;
},

generateTtf = function(config) {

    var script = 'Open($1);SetFontNames($3,$3,$3);Generate($2, "", 8);',
        source = config.source,
        target = config.ttf,
        name   = config.name;

    return fontforge(source, script, target, name);
},

generateEot = function(config) {

    var source = config.ttf,
        target = config.eot;

    return ttf2eot(source, target);
},

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
