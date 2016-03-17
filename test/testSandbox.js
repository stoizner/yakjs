/* global: global */

// Setup of test libs
global.chai = require('chai');
global.sinon = require('sinon');
global.sinonChai = require('sinon-chai');
global.expect = global.chai.expect;
global.chai.use(global.sinonChai);

// Setting global dependencies
global.yak = {};
global._ = require('underscore');

// Setup namespaces
yak.exports = yak.exports || {};
yak.api = yak.api || {};

// Load server source files
require('require-all')({
    dirname:  __dirname + '/../server/src',
    recursive: true
});

// Replace the global logger with a silent logger.
yak.Logger = require('./loggerStub').LoggerStub;
