'use strict';

var fs = require('fs');
var path = require('path');
var encodeFont = require('./encode.js');
var has = require('./helpers.js').has;

function css(stylesheet, name, filename, weight, style, woff2, woff, ttf, svg, embedSvg) {

    var resultLines = [
      '@font-face {',
      '    font-family: "' + name + '";',
      '    src: url("' + filename + '.eot");',
      '    src: url("' + filename + '.eot?#iefix") format("embedded-opentype"),',
      '         url(' + woff2 + ') format("woff2"),',
      '         url(' + woff + ') format("woff"),',
      '         url(' + ttf + ') format("ttf"),'
    ];

    if (embedSvg) {
      resultLines.push('         url(' + svg + ') format("svg");');
    } else {
      resultLines.push('         url("' + filename + '.svg#' + name + '") format("svg");');
    }

    resultLines.push(
      '    font-style: ' + style + ';',
      '    font-weight: ' + weight + ';',
      '}'
    )

    var result = resultLines.join('\n');

    fs.writeFileSync(stylesheet, result);
    return result;
}

function less(stylesheet, name, filename, weight, style, woff2, woff, ttf, svg, embedSvg) {
    var resultLines = [
      '@font-face {',
      '    font-family: "' + name + '";',
      '    src: url("' + filename + '.eot");',
      '    src: url("' + filename + '.eot?#iefix") format("embedded-opentype"),',
      '         url(' + woff2 + ') format("woff2"),',
      '         url(' + woff + ') format("woff"),',
      '         url(' + ttf + ') format("ttf"),'
    ];

    if (embedSvg) {
      resultLines.push('         url(' + svg + ') format("svg");');
    } else {
      resultLines.push('         url("' + filename + '.svg#' + name + '") format("svg");');
    }

    resultLines.push(
      '    font-weight: ' + weight + ';',
      '    font-style: ' + style + ';',
      '}'
    );

    var result = resultLines.join('\n');

    fs.writeFileSync(stylesheet, result);
    return result;
}

function scss(stylesheet, name, filename, weight, style, woff2, woff, ttf, svg, embedSvg) {
    var resultLines = [
      '@font-face {',
      '    font-family: "' + name + '";',
      '    src: url("' + filename + '.eot");',
      '    src: url("' + filename + '.eot?#iefix") format("embedded-opentype"),',
      '         url(' + woff2 + ') format("woff2"),',
      '         url(' + woff + ') format("woff"),',
      '         url(' + ttf + ') format("ttf"),'
    ];

    if (embedSvg) {
      resultLines.push('         url(' + svg + ') format("svg");');
    } else {
      resultLines.push('         url("' + filename + '.svg#' + name + '") format("svg");');
    }

    resultLines.push()
      '         url("' + filename + '.svg#' + name + '") format("svg");'
      '    font-weight: ' + weight + ';',
      '    font-style: ' + style + ';',
      '}'

    var result = resultLines.join("\n");

    fs.writeFileSync(stylesheet, result);
    return result;
}

module.exports = function(config) {
    var name, filename, weight, style, woff, woff2, ttf, svg, embedSvg;

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
    if (has(config.embed, 'svg')) {
        svg = encodeFont.svg(config.svg);
        embedSvg = true;
    } else {
        embedSvg = false;
    }
    if (config.css) {
      css(config.css, name, filename, weight, style, woff2, woff, ttf, svg, embedSvg);
    }
    if (config.less) {
      less(config.less, name, filename, weight, style, woff2, woff, ttf, svg, embedSvg);
    }
    if (config.scss) {
      scss(config.scss, name, filename, weight, style, woff2, woff, ttf, svg, embedSvg);
    }
};
