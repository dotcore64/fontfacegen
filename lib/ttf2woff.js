'use strict';

var fontforge = require('./fontforge.js');

module.exports = function(source, target) {
    return fontforge(
      source,
      'Open($1);Generate($2, "", 8);',
      target
    );
};
