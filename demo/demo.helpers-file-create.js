'use strict';

// Core modules
var path = require('path');

// Custom modules
var helpersFile = require('../lib/helpers').helpersFile;

var customTplPaths = [];

var tpl = helpersFile.getPaths(path.join(__dirname, '../lib/tpl'), {
    exts: [],
    paths: customTplPaths,
    recursive: true
});

tpl.forEach(function (file) {
    var dir  = path.join(__dirname, 'created');
    var dest = path.join(dir, path.basename(file));

    helpersFile.getContent(file, function onComplete(err, data) {
        if (!err) {
            var content = data;

            helpersFile.create(dest, content, function onComplete(err, data) {
                if (!err) {
                    console.log(content);
                } else {
                    console.error(err);
                }
            });
        } else {
            console.error(err);
        }
    });
});
