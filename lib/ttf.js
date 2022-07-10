import fontforge from './fontforge.js';

// TODO: Require subset to be a Set from the beginning
const uniqueChars = (subset) => [...new Set(typeof subset === 'string' ? [...subset] : subset)];

const charToHex = (ch) => ch.codePointAt(0).toString(16);

const subsetToSelectFewer = (subset) => uniqueChars(subset)
  .map((ch) => `SelectFewer(0u${charToHex(ch)});`)
  .join('');

const getSubsetCommand = (subset) => (subset
  ? `SelectWorthOutputting();${subsetToSelectFewer(subset)}DetachAndRemoveGlyphs();`
  : '');

export default (source, target, name, { subset } = {}) => fontforge(
  source,
  `Open($1);SetFontNames($3,$3,$3);${getSubsetCommand(subset)}Generate($2, "", 8);`,
  target,
  name,
);
