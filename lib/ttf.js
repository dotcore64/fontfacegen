'use strict';

var fontforge = require('./fontforge.js');

module.exports = function(source, target, name) {
    return fontforge(
      source,
      'Open($1);SetFontNames($3,$3,$3);Generate($2, "", 8);',
      target,
      name
    );
};
