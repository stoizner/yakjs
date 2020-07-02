/* global: global */

// Setup of test libs
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import dirtyChai from 'dirty-chai';

const expect = chai.expect;
chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.use(dirtyChai);

// Export stuff for writing tests.
export default {
    expect: expect,
    sinon: sinon,
};
