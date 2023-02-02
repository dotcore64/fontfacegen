const fontforge = require('./fontforge.js');

module.exports = (source, target) => (
  fontforge(
    source,
    'Open($1);Generate($2, "", 8);',
    target,
  )
);
