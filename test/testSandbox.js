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

// Replace the global logger with a quit one.
yak.Logger = require('./loggerStub').LoggerStub;
