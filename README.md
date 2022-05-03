
# fontfacegen

From a ttf or otf, generate the required ttf, eot, woff, svg and css for the
font to be used in browsers.

## Installing

    npm install --save-dev fontfacegen

## Requirements:

- `fontforge`

### Installing on OS X

    brew install fontforge

### Other platforms

Help is required to get `fontfacegen` running on Window and Linux.
Any documentation on running on these platforms would be greatly appreciated.

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

**Default**: `null` (Guess the css filename from the font filename)

### css_fontpath:

Path to the font files relative to the css generated.

**Default**: `''`

### subset:

A string or array with the characters desired to be included inside the generated fonts

**Default**: `null`

### collate:

Append the source filename to the destination directory in order to collate generated fonts into separate directories.

**Default**: `false`

**IE**:

    options = {
        source: 'src/fonts/ariel.ttf',
        dest: 'dist/fonts/',
        collate: true
    }

Will create fonts into `'dist/fonts/ariel/'`.

### embed:

**Type**: `array`
**Default**: `[]`
**Valid values**: `['woff', 'ttf']`

Type of fonts to embed directly into the generated css file as a data-uri instead of creating files for them.


## Font config files:

Font name, style and weight can be specified manually per font in a json file of the same name as the font.

For example, for the font: `fonts/sans.ttf` the config file would be: `fonts/sans.json`.

Example file format:

    {
        "name"   : "Super Sans",
        "weight" : "400",
        "style"  : "normal"
    }

Note: If present, the json config file must be valid json.


## Complete example:


    var fs          = require('fs');
    var path        = require('path');
    var fontfacegen = require('./fontfacegen');

    var source = 'tmp/';
    var dest   = 'tmp/dest/';
    var fonts  = fs.readdirSync(source);

    for (var i = fonts.length - 1; i >= 0; i--) {
        var font = fonts[i];
        var extension = path.extname(font);
        var fontname = path.basename(font, extension);

        // Test with embedded ttf
        if (extension == '.ttf' || extension == '.otf') {
            fontfacegen({
                source: path.join(source, font),
                dest: dest,
                css: dest + 'css/' + fontname + '.css',
                css_fontpath: '../fonts/',
                embed: ['ttf'],
                subset: 'abcdef',
                collate: true
            });
        }
    };
