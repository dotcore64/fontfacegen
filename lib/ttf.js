import fontforge from './fontforge.js';
import { uniqueChars, charToHex } from './helpers.js';

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
