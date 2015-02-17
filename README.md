
# fontfacegen

From a ttf or otf, generate the required ttf, eot, woff, svg and css for the
font to be used in browers.

## Installing

    npm install --save-dev fontfacegen

## Requirements:

- `fontforge`
- `ttf2eot`
- `batik-ttf2svg`

### Installing on OS X

    brew install fontforge ttf2eot batik

### Other platforms

Help is required if you qould like to contribute instructions.

## Usage:

    var fontfacegen = require('fontfacegen');

    var result = fontfacegen({
        source: '/path/to/source.{ttf,otf}',
        dest: '/destination/folder/',
    });

## Options:

### source (required):

Path to the source font file in ttf or otf format.

### dest (required):

Path to the destination folder for the converted fonts to be placed in.

### css:

Path to the destination file to write the generated stylesheet to.

### css_fontpath:

Path to the font files relative to the css generated.

Default = ''

### collate:

Append the source filename to the destination directory in order to collate generated fonts into separate directories.

Default = `false`

IE:

    options = {
        source: 'src/fonts/ariel.ttf',
        dest: 'dist/fonts/',
        collate: true
    }

Will create fonts into `'dist/fonts/ariel/'`.

### embed:

Type: `array`
Default: `[]`
Valid values: `['woff', 'ttf']`

Type of fonts to embed directly into the generated css file as a data-uri instead of creating files for them.


## Font config files:

Font name, style and weight can be specified manually per font in a json file of the same name as the font.

For example, for the font: `fonts/sans.ttf` the config file would be: `fonts/sans.json`.

Exmaple file format:

    {
        "name"   : "Super Sans",
        "weight" : "400",
        "style"  : "normal"
    }

Note: If present, the json config file must be valid json.


## Complete example:


    var fs          = require('fs');
    var path        = require('path');
    var exec        = require('sync-exec');
    var fontfacegen = require('./fontfacegen');

    var source = 'tmp/';
    var dest   = 'tmp/dest/';
    var fonts  = fs.readdirSync(source);

    exec('rm -rf ' + dest);

    for (var i = fonts.length - 1; i >= 0; i--) {
        var font = fonts[i];
        var extension = path.extname(font);
        var fontname = path.basename(font, extension);

        // Test with embedded ttf
        if (extension == '.ttf' || extension == '.otf') {
            fontfacegen({
                source: path.join(source, font),
                dest: dest,
                css_fontpath: '../fonts/',
                embed: ['ttf'],
                collate: true
            });
        }
    };
