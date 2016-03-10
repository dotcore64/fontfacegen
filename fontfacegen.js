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

fs         = require('fs'),
os         = require('os'),
path       = require('path'),
child      = require('child_process'),
ttf2woff2  = require('ttf2woff2'),
has        = require('./lib/helpers.js').has,
quote      = require('./lib/helpers.js').quote,
merge      = require('./lib/helpers.js').merge,
fontforge  = require('./lib/fontforge.js'),

isLinux = os.type().toLowerCase() == "linux",

requiredCommands = (function () {
    requiredCommands = {
        ttfautohint: 'ttfautohint',
        ttf2eot: 'ttf2eot',
    };
    if (isLinux) {
        requiredCommands.ttf2svg = 'ttf2svg';
    } else{
        requiredCommands['batik-ttf2svg'] = 'batik';
    }
    return requiredCommands;
})(),


// ----------------------------------------------------------------------------

generateFontFace = function(options) {

    generateGlobals(options);
    var config = generateConfig(options);

    createDestinationDirectory(config.dest_dir);
    createDestinationDirectory(path.dirname(config.css));
    createDestinationDirectory(path.dirname(config.less));
    createDestinationDirectory(path.dirname(config.scss));
    generateTtf(config);
    generateEot(config);
    generateSvg(config);
    generateWoff(config);
    generateWoff2(config);
    generateStylesheet(config);

    return config.fonts;
},


// ----------------------------------------------------------------------------

globals = null,

generateGlobals = function(options) {
    var missing = [];
    globals = {};

    Object.keys(requiredCommands).forEach(function(cmd){
        if (options[cmd]) {
            globals[cmd] = options[cmd];
        } else {
            globals[cmd] = commandPath(cmd);
        }
        if (!globals[cmd]) {
            missing.push(requiredCommands[cmd]);
        }
    });

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
        } else{
            throw new FontFaceException(
                'We are missing some required font packages.\n' +
                'That can be installed with:\n' +
                'brew install ' + missing.join(' '));
        }
    }

    // Only needs to be done once
    generateGlobals = function(){}
},

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

createDestinationDirectory = function(dest) {
    if (!fs.existsSync(dest)) {
        child.execSync('mkdir -p ' + quote(dest));
    }
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
},

generateStylesheet = function(config) {
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
        woff2 = embedFont(config.woff2);
    }
    if (has(config.embed, 'woff')) {
        woff = embedFont(config.woff);
    }
    if (has(config.embed, 'ttf')) {
        ttf = embedFont(config.ttf);
    }
    if (config.css) {
      generateCSSStyleSheet(config.css, name, filename, weight, style, woff2, woff, ttf);
    }
    if (config.less) {
      generateLESSStyleSheet(config.less, name, filename, weight, style, woff2, woff, ttf);
    }
    if (config.scss) {
      generateSCSSStyleSheet(config.scss, name, filename, weight, style, woff2, woff, ttf);
    }
},

generateCSSStyleSheet = function(stylesheet, name, filename, weight, style, woff2, woff, ttf) {
    var result = [
      '@font-face {',
      '    font-family: "' + name + '";',
      '    src: url("' + filename + '.eot");',
      '    src: url("' + filename + '.eot?#iefix") format("embedded-opentype"),',
      '         url('  + woff2    + ') format("woff2"),',
      '         url('  + woff     + ') format("woff"),',
      '         url('  + ttf      + ') format("truetype"),',
      '         url("' + filename + '.svg#' + name + '") format("svg");',
      '    font-weight: ' + weight + ';',
      '    font-style: ' + style + ';',
      '}'].join("\n");
      
    fs.writeFileSync(stylesheet, result);
    return result;
},

generateLESSStyleSheet = function(stylesheet, name, filename, weight, style, woff2, woff, ttf) {
    var result = [
      '@font-face {',
      '    font-family: "' + name + '";',
      '    src: url("' + filename + '.eot");',
      '    src: url("' + filename + '.eot?#iefix") format("embedded-opentype"),',
      '         url('  + woff2    + ') format("woff2"),',
      '         url('  + woff     + ') format("woff"),',
      '         url('  + ttf      + ') format("truetype"),',
      '         url("' + filename + '.svg#' + name + '") format("svg");',
      '    font-weight: ' + weight + ';',
      '    font-style: ' + style + ';',
      '}'].join("\n");

    fs.writeFileSync(stylesheet, result);
    return result;
},

generateSCSSStyleSheet = function(stylesheet, name, filename, weight, style, woff2, woff, ttf) {
    var result = [
      '@font-face {',
      '    font-family: "' + name + '";',
      '    src: url("' + filename + '.eot");',
      '    src: url("' + filename + '.eot?#iefix") format("embedded-opentype"),',
      '         url('  + woff2    + ') format("woff2"),',
      '         url('  + woff     + ') format("woff"),',
      '         url('  + ttf      + ') format("truetype"),',
      '         url("' + filename + '.svg#' + name + '") format("svg");',
      '    font-weight: ' + weight + ';',
      '    font-style: ' + style + ';',
      '}'].join("\n");

    fs.writeFileSync(stylesheet, result);
    return result;
},


// ----------------------------------------------------------------------------

FontFaceException = function(message) {
   this.message = message;
   this.name = "FontFaceException";
},

commandPath = function(command) {
    try {
        var result = child.execSync('which ' + command, {
            encoding: 'utf-8'
        });
        if (result) {
            return result.trim();
        }
    }
    catch (e) {
        if (e.status == 1) {
            return false;
        }
        throw(e);
    }
    return false;
},

ttf2eot = function(source, dest) {
    var command, result, success;

    command = [globals.ttf2eot, quote(source), '>', quote(dest)].join(' ');

    result = child.execSync(command);
    success = result;

    if (! success) {
        throw new FontFaceException(
            'ttf2eot command failed\n' +
            'From command: ' + command + '\n' +
            result.trim() + '\n' +
            'Your EOT file will probably not be in a working state');
    }

    return result;
},

ttf2svg = function(source, target, name) {
    var command, result, success;

    if (isLinux) {
        command = [globals.ttf2eot, quote(source), '>', quote(target)].join(' ');
    } else{
        command = [globals['batik-ttf2svg'], quote(source), '-id', quote(name), '-o', quote(target)].join(' ');
    }
    
    result = child.execSync(command);
    success = result;

    if (! success) {
        throw new FontFaceException(
            'ttf2svg command failed\n' +
            'From command: ' + command + '\n' +
            result.trim() + '\n' +
            'Your SVG file will probably not be in a working state');
    }
    return result;
},

// Convert font file to data:uri and *remove* source file.
embedFont = function(fontFile) {
    var dataUri, type, fontUrl;

    // Convert to data:uri
    dataUri = fs.readFileSync(fontFile, 'base64');
    type = path.extname(fontFile).substring(1);
    fontUrl = 'data:application/x-font-' + type + ';charset=utf-8;base64,' + dataUri;

    // Remove source file
    fs.unlinkSync(fontFile);

    return fontUrl;
};

module.exports = generateFontFace;
