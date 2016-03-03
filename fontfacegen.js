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

fs     = require('fs'),
os     = require('os'),
path   = require('path'),
child  = require('child_process'),



isLinux = os.type().toLowerCase() == "linux",

requiredCommands = (function () {
    requiredCommands = {
        fontforge: 'fontforge',
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

weight_table = {
    thin:           '100',
    extralight:     '200',
    book:           '300',
    light:          '300',
    medium:         'normal',
    normal:         'normal',
    demibold:       '600',
    semibold:       '700',
    bold:           '700',
    extrabold:      '800',
    black:          '900',
},


// ----------------------------------------------------------------------------

generateFontFace = function(options) {

    generateGlobals(options);
    var config = generateConfig(options);

    createDestinationDirectory(config.dest_dir);
    generateTtf(config);
    generateEot(config);
    generateSvg(config);
    generateWoff(config);
    generateStylesheet(config);

    return config.fonts
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
    _.css          = [_.target, '.css'].join('');
    _.css_fontpath = '';
    _.name         = getFontName(_.source);
    _.weight       = getFontWeight(_.source);
    _.style        = getFontStyle(_.source);
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

    return fontforge(script, source, target, name);
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

    return fontforge(script, source, target);
},

generateStylesheet = function(config) {
    var name, filename, weight, style, stylesheet, result, woff, ttf;

    name       = config.name;
    filename   = (config.collate)
        ? path.join(config.css_fontpath, config.basename, config.basename)
        : path.join(config.css_fontpath, config.basename);
    weight     = config.weight;
    style      = config.style;
    stylesheet = config.css;
    woff       = '"' + filename + '.woff"';
    ttf        = '"' + filename + '.ttf"';

    if (has(config.embed, 'woff')) {
        woff = embedFont(config.woff);
    }
    if (has(config.embed, 'ttf')) {
        ttf = embedFont(config.ttf);
    }

    result = [
        '@font-face {',
        '    font-family: "' + name + '";',
        '    src: url("' + filename + '.eot");',
        '    src: url("' + filename + '.eot?#iefix") format("embedded-opentype"),',
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

getFontName = function(source) {
    var result = fontforge('Open($1);Print($fontname);', source);
    if (result.status == 0) {
        return result.stdout.trim().replace(' ', '_');
    }
    return false;
},

getFontWeight = function(source) {
    var result = fontforge('Open($1);Print($weight);', source);
    if (result.status == 0) {
        var weight = result.stdout.trim().replace(' ', '').toLowerCase();
        if (weight_table[weight])
            return weight_table[weight];
        return weight;
    }
    return false;
},

getFontStyle = function(source) {
    var result = fontforge('Open($1);Print($italicangle);', source);
    if (result.status == 0) {
        return (result.stdout.trim() == 0) ? 'normal' : 'italic';
    }
    return false;
},


// ----------------------------------------------------------------------------

FontFaceException = function(message) {
   this.message = message;
   this.name = "FontFaceException";
},

merge = function(destination, source) {
    for (var property in source) {
        if (source.hasOwnProperty(property)) {
            destination[property] = source[property];
        }
    }
    return destination;
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

fontforge = function() {
    var args, script, command, result, success;

    args = Array.prototype.slice.call(arguments);
    if (args.length < 1) {
        return false;
    }

    script = args.shift();

    command = globals.fontforge +
        ' -lang=ff -c \'' + script + '\'';

    args.forEach(function(arg){
        command += ' \'' + arg + '\'';
    });

    result = child.execSync(command + ' 2> /dev/null');
    success = result;

    if (! success) {
        throw new FontFaceException(
            'FontForge command failed\n' +
            'From command: ' + command + '\n' +
            result.trim());
    }
    return result;
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
},

quote = function(str) {
    return '"' + str + '"';
},

has = function(haystack, needle) {
    return haystack.indexOf(needle) !== -1;
};




module.exports = generateFontFace;
