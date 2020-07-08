/* global: global */

// Setup of test libs
import chai from 'chai';
import sinonModule from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import dirtyChai from 'dirty-chai';

chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.use(dirtyChai);

export const expect = chai.expect;
export const sinon = sinonModule;
