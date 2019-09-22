const path = require('path');
const fs = require('fs');
const { merge } = require('./helpers.js');
const fontforge = require('./fontforge.js');

module.exports = (options) => {
  const _ = {
    source: options.source,
    dest_dir: options.dest,
    collate: options.collate || false,
  };

  _.extension = path.extname(_.source);
  _.basename = path.basename(_.source, _.extension);
  _.dest_dir = _.collate ? path.join(_.dest_dir, _.basename) : _.dest_dir;
  _.target = path.join(_.dest_dir, _.basename);
  _.config_file = `${_.source.replace(_.extension, '')}.json`;
  _.ttf = [_.target, '.ttf'].join('');
  _.eot = [_.target, '.eot'].join('');
  _.svg = [_.target, '.svg'].join('');
  _.woff = [_.target, '.woff'].join('');
  _.woff2 = [_.target, '.woff2'].join('');
  _.css = [_.target, '.css'].join('');
  _.css_fontpath = '';
  _.name = fontforge.getName(_.source);
  _.weight = fontforge.getWeight(_.source);
  _.style = fontforge.getStyle(_.source);
  _.embed = [];

  if (fs.existsSync(_.config_file)) {
    merge(_, JSON.parse(fs.readFileSync(_.config_file)));
  }

  merge(_, options);

  return _;
};
