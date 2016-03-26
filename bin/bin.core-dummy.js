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
