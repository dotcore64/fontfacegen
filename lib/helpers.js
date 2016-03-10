'use strict';

function has(haystack, needle) {
    return haystack.indexOf(needle) !== -1;
}

function quote(str) {
    return '"' + str + '"';
}

function merge(destination, source) {
    for (var property in source) {
        if (source.hasOwnProperty(property)) {
            destination[property] = source[property];
        }
    }
    return destination;
}

module.exports.has = has;
module.exports.quote = quote;
module.exports.merge = merge;