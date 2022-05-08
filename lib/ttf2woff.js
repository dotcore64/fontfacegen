import fontforge from './fontforge.js';

export default (source, target) => (
  fontforge(
    source,
    'Open($1);Generate($2, "", 8);',
    target,
  )
);
