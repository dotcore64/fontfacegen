import { extname, basename, join } from 'node:path';
import { existsSync, readFileSync } from 'node:fs';

import { getName, getWeight, getStyle } from './fontforge.js';

export default ({
  source,
  dest,
  collate = false,
  ...options
}) => {
  const ext = extname(source);
  const base = basename(source, ext);
  const destDir = collate ? join(dest, base) : dest;
  const target = join(destDir, base);

  const configFile = source.replace(new RegExp(`${ext}$`), '.json');
  const config = existsSync(configFile) ? JSON.parse(readFileSync(configFile)) : {};

  return {
    source,
    dest_dir: options.dest_dir ?? config.dest_dir ?? destDir,
    collate,
    extension: options.extension ?? config.extension ?? ext,
    basename: options.basename ?? config.basename ?? base,
    target: options.target ?? config.target ?? target,
    ttf: options.ttf ?? config.ttf ?? `${target}.ttf`,
    eot: options.eot ?? config.eot ?? `${target}.eot`,
    svg: options.svg ?? config.svg ?? `${target}.svg`,
    woff: options.woff ?? config.woff ?? `${target}.woff`,
    woff2: options.woff2 ?? config.woff2 ?? `${target}.woff2`,
    css: options.css ?? config.css ?? `${target}.css`,
    css_fontpath: options.css_fontpath ?? config.css_fontpath ?? '',
    name: options.name ?? config.name ?? getName(source),
    weight: options.weight ?? config.weight ?? getWeight(source),
    style: options.style ?? config.style ?? getStyle(source),
    embed: options.embed ?? config.embed ?? [],
  };
};
