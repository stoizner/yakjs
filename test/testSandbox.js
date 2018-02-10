/* global: global */

// Setup of test libs
const chai = require('chai');
const sinon = require('sinon');
const sinonChai= require('sinon-chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
const dirtyChai = require('dirty-chai');

chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.use(dirtyChai);

// Export stuff for writing tests.
module.exports = {
    expect: expect,
    sinon: sinon,
};

// Setup some globals
global._ = {
    noop: () => {}
}
