import { extname, join } from 'node:path';
import {
  existsSync,
  unlinkSync,
  readFileSync,
  appendFileSync,
} from 'node:fs';

import { removeNewLines } from './helpers.js';

// Encode font file to data:uri and *remove* source file.
function uriEncodeFont(fontFile) {
  const dataUri = readFileSync(fontFile, 'base64'); // Convert to data:uri
  const type = extname(fontFile).slice(1);
  const fontUrl = `'data:application/x-font-${type};charset=utf-8;base64,${dataUri}'`;

  // Remove source file
  unlinkSync(fontFile);

  return fontUrl;
}

function uriEncodeSvg(fontFile) {
  const dataUri = removeNewLines(readFileSync(fontFile));
  const fontUrl = `'data:image/svg+xml;charset=utf8,${dataUri}'`;

  // Remove source file
  unlinkSync(fontFile);

  return fontUrl;
}

function css(stylesheet, name, filename, weight, style, woff2, woff, ttf, svg, embedSvg) {
  const result = [
    ...existsSync(stylesheet) ? [''] : [],
    '@font-face {',
    `    font-family: "${name}";`,
    `    src: url("${filename}.eot");`,
    `    src: url("${filename}.eot?#iefix") format("embedded-opentype"),`,
    `         url(${woff2}) format("woff2"),`,
    `         url(${woff}) format("woff"),`,
    `         url(${ttf}) format("ttf"),`,
    ...embedSvg ? [`         url(${svg}) format("svg");`] : [`         url("${filename}.svg#${name}") format("svg");`],
    `    font-style: ${style};`,
    `    font-weight: ${weight};`,
    '}',
  ].join('\n');

  appendFileSync(stylesheet, result);
  return result;
}

function less(stylesheet, name, filename, weight, style, woff2, woff, ttf, svg, embedSvg) {
  const result = [
    ...existsSync(stylesheet) ? [''] : [],
    '@font-face {',
    `    font-family: "${name}";`,
    `    src: url("${filename}.eot");`,
    `    src: url("${filename}.eot?#iefix") format("embedded-opentype"),`,
    `         url(${woff2}) format("woff2"),`,
    `         url(${woff}) format("woff"),`,
    `         url(${ttf}) format("ttf"),`,
    ...embedSvg ? [`         url(${svg}) format("svg");`] : [`         url("${filename}.svg#${name}") format("svg");`],
    `    font-weight: ${weight};`,
    `    font-style: ${style};`,
    '}',
  ].join('\n');

  appendFileSync(stylesheet, result);
  return result;
}

function scss(stylesheet, name, filename, weight, style, woff2, woff, ttf, svg, embedSvg) {
  const result = [
    ...existsSync(stylesheet) ? [''] : [],
    '@font-face {',
    `    font-family: "${name}";`,
    `    src: url("${filename}.eot");`,
    `    src: url("${filename}.eot?#iefix") format("embedded-opentype"),`,
    `         url(${woff2}) format("woff2"),`,
    `         url(${woff}) format("woff"),`,
    `         url(${ttf}) format("ttf"),`,
    ...embedSvg ? [`         url(${svg}) format("svg");`] : [`         url("${filename}.svg#${name}") format("svg");`],
    `    font-weight: ${weight};`,
    `    font-style: ${style};`,
    '}',
  ].join('\n');

  appendFileSync(stylesheet, result);
  return result;
}

export default ({
  name,
  collate,
  basename,
  embed,
  weight,
  style,
  css_fontpath: cssFontpath,
  ...config
}) => {
  const filename = collate
    ? join(cssFontpath, basename, basename)
    : join(cssFontpath, basename);

  const woff2 = embed.includes('woff2') ? uriEncodeFont(config.woff2) : `"${filename}.woff2"`;
  const woff = embed.includes('woff') ? uriEncodeFont(config.woff) : `"${filename}.woff"`;
  const ttf = embed.includes('ttf') ? uriEncodeFont(config.ttf) : `"${filename}.ttf"`;
  const [svg, embedSvg] = embed.includes('svg') ? [uriEncodeSvg(config.svg), true] : [undefined, false];

  if (config.css) {
    css(config.css, name, filename, weight, style, woff2, woff, ttf, svg, embedSvg);
  }
  if (config.less) {
    less(config.less, name, filename, weight, style, woff2, woff, ttf, svg, embedSvg);
  }
  if (config.scss) {
    scss(config.scss, name, filename, weight, style, woff2, woff, ttf, svg, embedSvg);
  }
};
