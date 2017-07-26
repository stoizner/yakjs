/* global: global */

// Setup of test libs
const chai = require('chai');
const sinon = require('sinon');
const sinonChai= require('sinon-chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');

chai.use(sinonChai);
chai.use(chaiAsPromised);

// Export stuff for writing tests.
module.exports = {
    expect: expect,
    sinon: sinon,
};
