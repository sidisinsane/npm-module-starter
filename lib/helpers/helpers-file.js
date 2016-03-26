// File helper functions
module.exports = {
    create: function (dest, content, cb) {
        // Core modules
        var fs   = fs || require('fs');
        var path = path || require('path');
        // 3rd party modules
        var mkdirp = mkdirp || require('mkdirp');

        mkdirp(path.dirname(dest), function (err, data) {
            if (err) {
                cb(true, err);
            }

            fs.writeFile(dest, content, function (err, data) {
                if (!err) {
                    cb(false, data);
                } else {
                    cb(true, err);
                }
            });
        });
    },

    getContent: function(file, cb) {
        // Core modules
        var fs = fs || require('fs');

        fs.readFile(file, {encoding: 'utf-8'}, function (err, data) {
            if (!err) {
                cb(false, data);
            } else {
                cb(true, err);
            }
        });
    },

    exists: function (file, cb) {
        // Core modules
        var fs = fs || require('fs');

        fs.stat(file, function (err, stat) {
            if (err === null) {
                cb(false, stat);
            } else if (err.code === 'ENOENT') {
                cb(new Error('File not found: ' + err));
            } else {
                cb(true, err);
            }
        });
    },

    getPaths: function (dir, options) {
        // Core modules
        var fs   = fs || require('fs');
        var path = path || require('path');

        // Set default options
        var o = {
            exts: [],
            paths: [],
            recursive: true
        }
        // Feed user configuration options
        if ('undefined' !== typeof options) {
            for (var i in options) {
                if ('undefined' !== typeof options[i]) {
                    o[i] = options[i];
                }
            }
        }

        fs.readdirSync(dir).forEach(function (file) {
            if (fs.statSync(dir + '/' + file).isDirectory()) {
                if (o.recursive) {
                    o.paths = module.exports.getFilePaths(dir + '/' + file, options);
                }
            } else {
                if (o.exts.length > 0) {
                    var ext = path.extname(file).replace('.', '');
                    if (o.exts.indexOf(ext) > -1) {
                        o.paths.push(path.join(dir, file));
                    }
                } else {
                    o.paths.push(path.join(dir, file));
                }
            }
        });

        return o.paths;
    }
};
