"use strict";
var fs_1 = require('fs');
var path_1 = require('path');
var utils_1 = require('./utils');
var filename = process.argv[2].split(/(\/|\\)/g).reverse()[0];
var filepath = process.argv[2].replace(filename, '');
var content = fs_1.readFileSync(path_1.resolve(filepath, filename), 'utf-8');
var hashables = utils_1.flatMap(function (f) { return f(content); }, [utils_1.getScriptRefs, utils_1.getStyleRefs])
    .filter(function (x) { return x.match(/\.(css|js|html)$/); });
var timestamp = ((new Date).getTime() / 1000).toFixed(0);
var fileWithTime = utils_1.addTimestamp(timestamp);
var contentOutput = hashables.reduce(function (acc, h) {
    try {
        fs_1.renameSync(path_1.join('./', filepath, h), path_1.join('./', filepath, fileWithTime(h)));
    }
    catch (e) {
        console.error(e);
    }
    return acc.replace(h, fileWithTime(h));
}, content).replace(/<head>([\s\S]*)<\/head>/, "<head>\n    $1\t<meta http-equiv=\"expires\" content=\"0\">\n</head>");
fs_1.writeFileSync(path_1.resolve(filepath, filename), contentOutput, 'utf-8');
