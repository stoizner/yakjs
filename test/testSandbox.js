/* global: global */

// Setup of test libs
var chai = require('chai');
var sinon = require('sinon');
var sinonChai= require('sinon-chai');
var expect = chai.expect;

chai.use(sinonChai);

// Setting global dependencies
global.yak = {};
global._ = require('underscore');

// Setup namespaces
yak.modules = yak.modules || {};
yak.api = yak.api || {};

// Load server source files
require('require-all')({
    dirname:  __dirname + '/../server/src',
    recursive: true
});

// Replace the global logger with a silent logger.
yak.Logger = require('./loggerStub').LoggerStub;

// Export stuff for writing tests.
module.exports = {
    expect: expect,
    sinon: sinon
};
