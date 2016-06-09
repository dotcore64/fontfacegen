'use strict';

var fs = require('fs');
var path = require('path');
var removeNewLines = require('./helpers').removeNewLines;

// Encode font file to data:uri and *remove* source file.
module.exports = function (fontFile) {
    var dataUri, type, fontUrl;

    // Convert to data:uri
    dataUri = fs.readFileSync(fontFile, 'base64');
    type = path.extname(fontFile).substring(1);
    fontUrl = '\'data:application/x-font-' + type + ';charset=utf-8;base64,' + dataUri + '\'';

    // Remove source file
    fs.unlinkSync(fontFile);

    return fontUrl;
}

module.exports.svg = function(fontFile) {
    var dataUri, fontUrl;

    dataUri = removeNewLines(fs.readFileSync(fontFile));
    fontUrl = '\'data:image/svg+xml;charset=utf8,' + dataUri + '\'';

    // Remove source file
    fs.unlinkSync(fontFile);

    return fontUrl;
}