'use strict';

var fs = require('fs');
var path = require('path');

// Encode font file to data:uri and *remove* source file.
module.exports = function (fontFile) {
    var dataUri, type, fontUrl;

    // Convert to data:uri
    dataUri = fs.readFileSync(fontFile, 'base64');
    type = path.extname(fontFile).substring(1);
    fontUrl = 'data:application/x-font-' + type + ';charset=utf-8;base64,' + dataUri;

    // Remove source file
    fs.unlinkSync(fontFile);

    return fontUrl;
}
