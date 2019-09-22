const fontforge = require('./fontforge.js');
const { uniqueChars, charToHex } = require('./helpers.js');

module.exports = (source, target, name, opts = {}) => {
  const { subset } = opts;
  let subsetCmd = '';

  if (subset) {
    subsetCmd = uniqueChars(subset)
      .map((ch) => `SelectFewer(0u${charToHex(ch)});`)
      .join('');
    subsetCmd = `SelectWorthOutputting();${subsetCmd}DetachAndRemoveGlyphs();`;
  }

  return fontforge(
    source,
    `Open($1);SetFontNames($3,$3,$3);${subsetCmd}Generate($2, "", 8);`,
    target,
    name,
  );
};
