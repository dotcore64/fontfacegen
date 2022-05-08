import { existsSync, appendFileSync } from 'node:fs';
import { join } from 'node:path';

import encodeFont, { svg as encodeSvg } from './encode.js';

function css(stylesheet, name, filename, weight, style, woff2, woff, ttf, svg, embedSvg) {
  const resultLines = [
    '@font-face {',
    `    font-family: "${name}";`,
    `    src: url("${filename}.eot");`,
    `    src: url("${filename}.eot?#iefix") format("embedded-opentype"),`,
    `         url(${woff2}) format("woff2"),`,
    `         url(${woff}) format("woff"),`,
    `         url(${ttf}) format("ttf"),`,
  ];

  if (embedSvg) {
    resultLines.push(`         url(${svg}) format("svg");`);
  } else {
    resultLines.push(`         url("${filename}.svg#${name}") format("svg");`);
  }

  resultLines.push(
    `    font-style: ${style};`,
    `    font-weight: ${weight};`,
    '}',
  );

  let result = resultLines.join('\n');

  if (existsSync(stylesheet)) result = `\n${result}`;

  appendFileSync(stylesheet, result);
  return result;
}

function less(stylesheet, name, filename, weight, style, woff2, woff, ttf, svg, embedSvg) {
  const resultLines = [
    '@font-face {',
    `    font-family: "${name}";`,
    `    src: url("${filename}.eot");`,
    `    src: url("${filename}.eot?#iefix") format("embedded-opentype"),`,
    `         url(${woff2}) format("woff2"),`,
    `         url(${woff}) format("woff"),`,
    `         url(${ttf}) format("ttf"),`,
  ];

  if (embedSvg) {
    resultLines.push(`         url(${svg}) format("svg");`);
  } else {
    resultLines.push(`         url("${filename}.svg#${name}") format("svg");`);
  }

  resultLines.push(
    `    font-weight: ${weight};`,
    `    font-style: ${style};`,
    '}',
  );

  let result = resultLines.join('\n');

  if (existsSync(stylesheet)) result = `\n${result}`;

  appendFileSync(stylesheet, result);
  return result;
}

function scss(stylesheet, name, filename, weight, style, woff2, woff, ttf, svg, embedSvg) {
  const resultLines = [
    '@font-face {',
    `    font-family: "${name}";`,
    `    src: url("${filename}.eot");`,
    `    src: url("${filename}.eot?#iefix") format("embedded-opentype"),`,
    `         url(${woff2}) format("woff2"),`,
    `         url(${woff}) format("woff"),`,
    `         url(${ttf}) format("ttf"),`,
  ];

  if (embedSvg) {
    resultLines.push(`         url(${svg}) format("svg");`);
  } else {
    resultLines.push(`         url("${filename}.svg#${name}") format("svg");`);
  }

  resultLines.push(
    `         url("${filename}.svg#${name}") format("svg");`,
    `    font-weight: ${weight};`,
    `    font-style: ${style};`,
    '}',
  );

  let result = resultLines.join('\n');

  if (existsSync(stylesheet)) result = `\n${result}`;

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

  const woff2 = embed.includes('woff2') ? encodeFont(config.woff2) : `"${filename}.woff2"`;
  const woff = embed.includes('woff') ? encodeFont(config.woff) : `"${filename}.woff"`;
  const ttf = embed.includes('ttf') ? encodeFont(config.ttf) : `"${filename}.ttf"`;
  const [svg, embedSvg] = embed.includes('svg') ? [encodeSvg(config.svg), true] : [undefined, false];

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
