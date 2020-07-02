import sandbox from '../../testSandbox';
import mockery from 'mockery';

const sinon = sandbox.sinon;
const expect = sandbox.expect;

describe('StoreProvider', function() {
    'use strict';

    /**
     * @type {!StoreProvider}
     */
    let sut;

    beforeEach(function() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        // Set up stubs

        // Create subject under test
        sut = require('../../../src/store/storeProvider');
    });

    afterEach(function() {
        mockery.deregisterAll();
        mockery.disable();
    });

    describe('constructor', function() {
        it('returns a new instance', function() {
            // Then
            expect(sut.constructor.name).to.deep.equal('StoreProvider');
        });
    });
});
