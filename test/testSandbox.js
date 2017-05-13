/* global: global */

// Setup of test libs
const chai = require('chai');
const sinon = require('sinon');
const sinonChai= require('sinon-chai');
const expect = chai.expect;

chai.use(sinonChai);

// Export stuff for writing tests.
module.exports = {
    expect: expect,
    sinon: sinon,
};
