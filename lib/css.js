'use strict';

var fs = require('fs');

function generateCSSStyleSheet(stylesheet, name, filename, weight, style, woff2, woff, ttf) {

    var resultlines = [
      '@font-face {',
      '    font-family: "' + name + '";',
      '    src: url("' + filename + '.eot");',
      '    src: url("' + filename + '.eot?#iefix") format("embedded-opentype"),'
    ];

    if (woff2) {
      resultlines.push('         url(' + woff2 + ') format("woff2"),');
    }

    if (woff) {
      resultlines.push('         url(' + woff + ') format("woff"),');
    }

    if (ttf) {
      resultlines.push('         url(' + ttf + ') format("ttf"),');
    }

    resultlines.push(
      '         url("' + filename + '.svg#' + name + '") format("svg");',
      '    font-style: ' + style + ';',
      '    font-weight: ' + weight + ';',
      '}'
    )

    var result = resultlines.join('\n');

    fs.writeFileSync(stylesheet, result);
    return result;
}

module.exports = generateCSSStyleSheet;