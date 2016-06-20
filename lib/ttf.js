'use strict';

var fontforge = require('./fontforge.js');
var uniqueChars = require('./helpers.js').uniqueChars;
var charToHex = require('./helpers.js').charToHex;

module.exports = function(source, target, name, opts) {
    opts = opts || {};

    var subset = opts.subset;
    var subsetCmd = '';

    if (subset) {
        subsetCmd = uniqueChars(subset)
        .map(function (ch) {
            return 'SelectFewer(0u' + charToHex(ch) + ');';
        })
        .join('');
        subsetCmd = 'SelectWorthOutputting();' + subsetCmd + 'DetachAndRemoveGlyphs();';
    }

    return fontforge(
      source,
      'Open($1);SetFontNames($3,$3,$3);' + subsetCmd + 'Generate($2, "", 8);',
      target,
      name
    );
};
