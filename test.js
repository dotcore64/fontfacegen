/**
 * test.js
 * https://github.com/agentk/fontfacegen
 *
 * Copyright 2015 Karl Bowden
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

var child = require('child_process');
var fs = require('fs');
var https = require('https');
var path = require('path');
var fontfacegen = require('./index.js');

var source = 'tmp/';
var dest = 'tmp/dest/';
var fileurl = 'https://raw.githubusercontent.com/google/fonts/master/apache/opensans/OpenSans-Regular.ttf';
var filename = 'OpenSans-Regular.ttf';
var sourcefile = source + filename;

// -----

cleanup(source, dest)
  .then(downloadFileIfMissing(fileurl, sourcefile))
  .then(processFont(sourcefile, dest))
  .catch(function(err) {
    console.error('ERROR TRACE: ', err);
  });

// -----

function cleanup(source, dest) {
    child.execSync('rm -rf ' + dest);
    child.execSync('mkdir -p ' + source);
    return Promise.resolve();
}

function downloadFileIfMissing(url, dest) {
  return function() {
    return new Promise(function (resolve, reject) {
      fs.access(dest, function(err) {
        if (!err) {
          return resolve();
        }
        download(url, dest).then(resolve, reject);
      });
    });
  }
}

function download(url, dest) {
  return new Promise(function(resolve, reject) {
    var file = fs.createWriteStream(dest);
    var request = https.get(url, function(response) {
      response.pipe(file);
      file.on('finish', function() {
        file.close(resolve);
      });
    }).on('error', function(err) {
      fs.unlink(dest);
      reject(err.message);
    });
  });
}

function processFont(source, dest) {
  return function(opt) {
    fontfacegen({
        source: source,
        dest: dest,
        css_fontpath: '../fonts/',
        css: 'tmp/dest/css/fonts.css',
        less: 'tmp/dest/less/fonts.less',
        scss: 'tmp/dest/scss/fonts.scss',
        embed: ['ttf', 'woff', 'woff2', 'svg'],
        collate: true
    });
    return Promise.resolve();
  }
}
