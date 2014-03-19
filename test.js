
var fs          = require('fs');
var path        = require('path');
var sh          = require('execSync');
var fontfacegen = require('./fontfacegen');

var source = 'tmp/';
var dest   = 'tmp/dest/';
var fonts  = fs.readdirSync(source);

sh.exec('rm -rf ' + dest);

for (var i = fonts.length - 1; i >= 0; i--) {
    var font = fonts[i];
    var extension = path.extname(font);
    var fontname = path.basename(font, extension);

    if (extension == '.ttf' || extension == '.otf') {
        fontfacegen({
            source: path.join(source, font),
            dest: dest,
            css_fontpath: '../fonts/'
        });
    }
};
