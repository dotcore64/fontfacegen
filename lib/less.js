'use strict';

function generateLESSStyleSheet(stylesheet, name, filename, weight, style, woff2, woff, ttf) {
    var resultLines = [
      '@font-face {',
      '    font-family: "' + name + '";',
      '    src: url("' + filename + '.eot");',
      '    src: url("' + filename + '.eot?#iefix") format("embedded-opentype"),',
      '         url("' + filename + '.svg#' + name + '") format("svg");'
    ];

    if (woff2) {
      resultLines.push('         url(' + woff2 + ') format("woff2"),');
    }

    if (woff) {
      resultLines.push('         url(' + woff + ') format("woff"),');
    }

    if (ttf) {
      resultLines.push('         url(' + ttf + ') format("truetype"),');
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

module.exports = generateLESSStyleSheet;