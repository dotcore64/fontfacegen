/**
 * test.js
 * https://github.com/dotcore64/fontfacegen
 *
 * Copyright 2015 Karl Bowden
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 * either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import child from 'node:child_process';
import fs from 'node:fs';
import https from 'node:https';

// eslint-disable-next-line import/no-unresolved,node/no-missing-import
import fontfacegen from 'fontfacegen';

const source = 'tmp/';
const dest = 'tmp/dest/';
const fileurl = 'https://raw.githubusercontent.com/googlefonts/opensans/main/fonts/ttf/OpenSans-Regular.ttf';
const filename = 'OpenSans-Regular.ttf';
const sourcefile = `${source}${filename}`;

// -----

cleanup(source, dest)
  .then(downloadFileIfMissing(fileurl, sourcefile))
  .then(processFont(sourcefile, dest))
  .catch((err) => {
    console.error('ERROR TRACE: ', err); // eslint-disable-line no-console
    return Promise.reject(err);
  });

// -----

function cleanup(source, dest) {
  child.execSync(`rm -rf ${dest}`);
  child.execSync(`mkdir -p ${source}`);
  return Promise.resolve();
}

function downloadFileIfMissing(url, dest) {
  return () => new Promise((resolve, reject) => {
    fs.access(dest, (err) => {
      if (!err) {
        return resolve();
      }
      return download(url, dest).then(resolve, reject);
    });
  });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);

    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest);
      reject(err.message);
    });
  });
}

function processFont(source, dest) {
  return () => {
    try {
      fontfacegen({
        source,
        dest,
        css_fontpath: '../fonts/',
        css: 'tmp/dest/css/fonts.css',
        less: 'tmp/dest/less/fonts.less',
        scss: 'tmp/dest/scss/fonts.scss',
        embed: ['ttf', 'woff', 'woff2', 'svg'],
        collate: true,
      });
    } catch (e) {
      return Promise.reject(e);
    }

    return Promise.resolve();
  };
}
