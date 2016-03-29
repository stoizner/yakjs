/* global: global */

// Setup of test libs
var chai = require('chai');
var sinon = require('sinon');
var sinonChai= require('sinon-chai');
var expect = chai.expect;

chai.use(sinonChai);

// Export stuff for writing tests.
module.exports = {
    expect: expect,
    sinon: sinon
};
