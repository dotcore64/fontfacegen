import { dirname } from 'node:path';

import { mkdirp } from './helpers.js';
import configure from './configure.js';
import ttf from './ttf.js';
import ttf2woff from './ttf2woff.js';
import ttf2woff2 from './ttf2woff2.js';
import ttf2eot from './ttf2eot.js';
import ttf2svg from './ttf2svg.js';
import stylesheets from './stylesheets.js';

export default (options) => {
  const config = configure(options);

  mkdirp(config.dest_dir);

  if (config.css) {
    mkdirp(dirname(config.css));
  }

  if (config.less) {
    mkdirp(dirname(config.less));
  }

  if (config.scss) {
    mkdirp(dirname(config.scss));
  }

  ttf(config.source, config.ttf, config.name, config); // TODO: better options handling
  ttf2eot(config.ttf, config.eot);
  ttf2svg(config.ttf, config.svg);
  ttf2woff(config.ttf, config.woff);
  ttf2woff2(config.ttf, config.woff2);
  stylesheets(config);
};
