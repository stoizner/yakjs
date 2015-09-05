#!/usr/bin/env node
var cli = require("../yakjs");
var exitCode = cli.execute(process.argv);

process.on('exit', function() {
    process.exit(exitCode);
});
