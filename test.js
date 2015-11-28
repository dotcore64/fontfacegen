
var child = require('child_process');
var fs = require('fs');
var https = require('https');
var path = require('path');
var fontfacegen = require('./fontfacegen');

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
        embed: ['ttf'],
        collate: true
    });
    return Promise.resolve();
  }
}
