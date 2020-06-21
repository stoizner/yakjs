const sandbox = require('../../testSandbox');
const sinon = sandbox.sinon;
const expect = sandbox.expect;
const mockery =  require('mockery');

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
