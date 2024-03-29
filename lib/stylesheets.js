import { existsSync, appendFileSync } from 'node:fs';
import { join } from 'node:path';

import encodeFont, { svg as encodeSvg } from './encode.js';
import { has } from './helpers.js';

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

export default (config) => {
  let woff;
  let woff2;
  let ttf;
  let svg;
  let embedSvg;

  const { name } = config;
  const filename = (config.collate)
    ? join(config.css_fontpath, config.basename, config.basename)
    : join(config.css_fontpath, config.basename);
  const { weight } = config;
  const { style } = config;

  woff2 = `"${filename}.woff2"`;
  woff = `"${filename}.woff"`;
  ttf = `"${filename}.ttf"`;

  if (has(config.embed, 'woff2')) {
    woff2 = encodeFont(config.woff2);
  }
  if (has(config.embed, 'woff')) {
    woff = encodeFont(config.woff);
  }
  if (has(config.embed, 'ttf')) {
    ttf = encodeFont(config.ttf);
  }
  if (has(config.embed, 'svg')) {
    svg = encodeSvg(config.svg);
    embedSvg = true;
  } else {
    embedSvg = false;
  }
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
