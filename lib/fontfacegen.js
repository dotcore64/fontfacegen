const path = require('path');
const { mkdirSync } = require('fs');

const configure = require('./configure.js');
const ttf = require('./ttf.js');
const ttf2woff = require('./ttf2woff.js');
const ttf2woff2 = require('./ttf2woff2.js');
const ttf2eot = require('./ttf2eot.js');
const ttf2svg = require('./ttf2svg.js');
const stylesheets = require('./stylesheets.js');

const mkdirp = (path) => mkdirSync(path, { recursive: true });

module.exports = (options) => {
  const config = configure(options);

  mkdirp(config.dest_dir);

  if (config.css) {
    mkdirp(path.dirname(config.css));
  }

  if (config.less) {
    mkdirp(path.dirname(config.less));
  }

  if (config.scss) {
    mkdirp(path.dirname(config.scss));
  }

  ttf(config.source, config.ttf, config.name, config); // TODO: better options handling
  ttf2eot(config.ttf, config.eot);
  ttf2svg(config.ttf, config.svg);
  ttf2woff(config.ttf, config.woff);
  ttf2woff2(config.ttf, config.woff2);
  stylesheets(config);
};
