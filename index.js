// Example code
var pkg = require('./package.json');

function getProp(obj, prop) {
    return obj[prop];
}

var jestCli = getProp(pkg.devDependencies, 'jest-cli');

console.log('This package requires jest-cli ' + jestCli);
