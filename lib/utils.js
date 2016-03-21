"use strict";
function flatMap(mapper, a) {
    return a.reduce(function (acc, a) { return acc.concat(mapper(a)); }, []);
}
exports.flatMap = flatMap;
var scriptRegex = /(<script[\s]*src=")(.*)(".*<\/script>)/g;
var styleRegex = /(<link.*href=")(.*)(".*\/>)/g;
var getReferences = function (reg, group) { return function (html) {
    return (html.match(reg) || [])
        .map(function (m) { return m.replace(reg, group); });
}; };
exports.getScriptRefs = getReferences(scriptRegex, '$2');
exports.getStyleRefs = getReferences(styleRegex, '$2');
exports.addTimestamp = function (timestamp) { return function (filename) {
    var s = filename.split('.').reverse();
    return s.slice(0, 1).concat([timestamp], s.slice(1))
        .reverse().join('.');
}; };
