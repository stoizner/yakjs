#!/usr/bin/env node

var path = require('path');
var yakjsModuleDir = path.join(path.dirname(process.argv[1]), '..');

// Change the process working directory.
process.chdir(yakjsModuleDir);

var cli = require('../yakjs.js');

process.on('exit', function() {
    process.exit(exitCode);
});
