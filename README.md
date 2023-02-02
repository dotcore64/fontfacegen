
# fontfacegen

[![Build Status][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coverage Status][coveralls-badge]][coveralls]

From a ttf or otf, generate the required ttf, eot, woff, svg and css for the
font to be used in browsers.

## Installing

    npm install --save-dev fontfacegen

## Requirements:

- [`fontforge`](https://fontforge.org/docs/)

### Installing fontforge

On MacOS:

    brew install fontforge

On Ubuntu:

    apt install fontforge

On other platforms, please refer to the [fontforge documentation](https://fontforge.org/docs/).

## Usage:

    import fontfacegen from 'fontfacegen';

    const result = fontfacegen({
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

### css\_fontpath:

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


    import { readdirSync } from 'node:fs';
    import { join, extname, basename } from 'node:path';
    import fontfacegen from 'fontfacegen';

    const source = 'tmp/';
    const dest   = 'tmp/dest/';
    const fonts  = readdirSync(source);

    for (const i = fonts.length - 1; i >= 0; i--) {
        const font = fonts[i];
        const extension = extname(font);
        const fontname = basename(font, extension);

        // Test with embedded ttf
        if (extension == '.ttf' || extension == '.otf') {
            fontfacegen({
                source: path.join(source, font),
                dest: dest,
                css_fontpath: '../fonts/',
                embed: ['ttf'],
                subset: 'abcdef',
                collate: true
            });
        }
    };

## License

See the [LICENSE](LICENSE.md) file for license rights and limitations (MIT).

[build-badge]: https://img.shields.io/github/actions/workflow/status/dotcore64/fontfacegen/test.yml?event=push&style=flat-square
[build]: https://github.com/dotcore64/fontfacegen/actions

[npm-badge]: https://img.shields.io/npm/v/fontfacegen.svg?style=flat-square
[npm]: https://www.npmjs.org/package/fontfacegen

[coveralls-badge]: https://img.shields.io/coveralls/dotcore64/fontfacegen/master.svg?style=flat-square
[coveralls]: https://coveralls.io/r/dotcore64/fontfacegen
