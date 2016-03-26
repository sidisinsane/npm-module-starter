# Npm module starter

Skeleton for creating a npm module

### Module commands

- `npm run test`: runs all tests in <q>\_\_tests\_\_</q>
- `npm run demo`: runs the demo in <q>demo/demo.helpers-file-create.js</q>
- `your-namespace--module-name--core-dummy -m 'I am a message!'` *(after running `npm link`)*: runs the globally available clt in <q>bin/bin.core-dummy.js</q>

__Don‘t forget to change <q>your-namspace</q> and <q>module-name</q>!__

### 3<sup>rd</sup> Party Modules

- [jest](https://facebook.github.io/jest/) for unit testing
- [mkdirp](https://github.com/substack/node-mkdirp) for recursive directoy creation
- [yargs](http://yargs.js.org/) for interactive cli building

### Files and folders

- \_\_tests\_\_
  - __jest.core-dummy.js__
- bin
  - __bin.core-dummy.js__
- demo
  - __demo.helpers-file-create.js__
- lib
  - helpers
    - __helpers-file.js__
    - index.js
  - tpl
    - .gitignore
    - .htaccess
  - __core.js__
  - __index.js__
- .gitignore
- __index.js__
- __LICENSE__
- __package.json__
- README.md

### Code excerpts

__package.json__
```json
{
  "name": "@your-namespace/module-name",
  "version": "1.0.0",
  "description": "your module description",
  "main": "index.js",
  "bin": {
    "your-namespace--module-name--core-dummy": "bin/bin.core-dummy.js"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/username/repo-name.git"
  },
  "scripts": {
    "test": "jest",
    "demo": "rm -rf demo/created && node demo/demo.helpers-file-create.js"
  },
  "license": "SEE LICENSE IN LICENSE",
  "dependencies": {
    "mkdirp": "^0.5.1",
    "yargs": "^4.3.2"
  },
  "devDependencies": {
    "jest-cli": "^0.9.2"
  }
}
```

__LICENSE__
```text
SEE: http://sid.mit-license.org/
```
*Hosted MIT License with details controlled through this repo http://mit-license.org. [More info here](https://github.com/remy/mit-license).*

__index.js__
```javascript
// Example code
var pkg = require('./package.json');

function getProp(obj, prop) {
    return obj[prop];
}

var jestCli = getProp(pkg.devDependencies, 'jest-cli');

console.log('This package requires jest-cli ' + jestCli);
```

__lib/helpers/helpers-file.js__
```javascript
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
```

__lib/core.js__
```javascript
module.exports = {
    dummy: function (message) {
        var message = message || 'I am the default message!';

        return message;
    }
};
```

__lib/index.js__
```javascript
// Shortcut for bulk export
'use strict';

exports.core = require('./core.js');
```

__demo/demo.helpers-file-create.js__
```javascript
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
```

__bin/bin.core-dummy.js__
```javascript
#! /usr/bin/env node

// 3rd party modules
var argv = require('yargs')
    .usage('Usage: -bash <command> [options]')
    .option('message', {
        type: 'string',
        alias: 'm',
        describe: 'Provide your message.'
    })
    .example("-bash --message 'It works!'", 'It works!')
    .help('help')
    .alias('help', 'h')
    .argv;

// Custom modules
var core = require('../lib/core.js');

// Set message
var message = argv.message || false;

// Output message
console.log(core.dummy(message));
```

__\_\_tests\_\_/jest.core-dummy.js__
```javascript
// Tell jest that it should always return the real module specified in require
jest.unmock('../lib/core.js');

// Describe test
describe('core.dummy', () => {
    it('returns given string', () => {
        const core = require('../lib/core.js');

        expect(core.dummy('It works!')).toBe('It works!');
    });
});
```
