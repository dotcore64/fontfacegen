'use strict';

function has(haystack, needle) {
    return haystack.indexOf(needle) !== -1;
}

function quote(str) {
    return '"' + str + '"';
}

module.exports.has = has;
module.exports.quote = quote;