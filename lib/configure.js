import { extname, basename, join } from 'node:path';
import { existsSync, readFileSync } from 'node:fs';

import { merge } from './helpers.js';
import { getName, getWeight, getStyle } from './fontforge.js';

export default (options) => {
  const _ = {
    source: options.source,
    dest_dir: options.dest,
    collate: options.collate || false,
  };

  _.extension = extname(_.source);
  _.basename = basename(_.source, _.extension);
  _.dest_dir = _.collate ? join(_.dest_dir, _.basename) : _.dest_dir;
  _.target = join(_.dest_dir, _.basename);
  _.config_file = `${_.source.replace(_.extension, '')}.json`;
  _.ttf = [_.target, '.ttf'].join('');
  _.eot = [_.target, '.eot'].join('');
  _.svg = [_.target, '.svg'].join('');
  _.woff = [_.target, '.woff'].join('');
  _.woff2 = [_.target, '.woff2'].join('');
  _.css = [_.target, '.css'].join('');
  _.css_fontpath = '';
  _.name = getName(_.source);
  _.weight = getWeight(_.source);
  _.style = getStyle(_.source);
  _.embed = [];

  if (existsSync(_.config_file)) {
    merge(_, JSON.parse(readFileSync(_.config_file)));
  }

  merge(_, options);

  return _;
};
