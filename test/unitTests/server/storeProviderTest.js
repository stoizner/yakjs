import {sinon, expect} from '../../testSandbox.js';
import {StoreProvider} from '../../../src/store/storeProvider.js';

describe('StoreProvider', function() {
    'use strict';

    /**
     * @type {!StoreProvider}
     */
    let sut;

    beforeEach(function() {
        // Set up stubs

        // Create subject under test
        sut = new StoreProvider();
    });

    describe('constructor', function() {
        it('returns a new instance', function() {
            // Then
            expect(sut.constructor.name).to.deep.equal('StoreProvider');
        });
    });
});
