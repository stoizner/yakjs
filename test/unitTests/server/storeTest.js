import {sinon, expect} from '../../testSandbox.js';
import {Store} from '../../../common/store.js';

describe('Store', function() {
    'use strict';

    /**
     * @type {!StoreProvider}
     */
    let storeProvider;

    /**
     * @type {!Store}
     */
    let store;

    beforeEach(function() {
        // Set up stubs
        storeProvider = {
            updateItem: sinon.stub(),
            getValue: sinon.stub(),
            deleteItem: sinon.stub(),
            hasValue: sinon.stub()
        };

        // Create subject under test
        store = new Store(storeProvider);
    });

    describe('setValue', function() {
        it('updates the item in the store', function() {
            // Given
            let data = 'test';

            // When
            store.setValue('my.key', data);

            // Then
            expect(storeProvider.updateItem).to.be.calledWith('my.key', data);
        });
    });

    describe('getValue', function() {
        it('returns null when key does not exist', function() {
            // Given
            storeProvider.getValue.returns(null);

            // When
            let data = store.getValue('keyWithoutValue');

            // Then
            expect(data).to.be.null();
        });

        it('returns value', function() {
            // Given
            var storedData = 'foo';
            storeProvider.getValue.withArgs('my.key').returns(storedData);

            // When
            let data = store.getValue('my.key');

            // Then
            expect(data).to.deep.equal(storedData);
        });
    });

    describe('deleteValue', function() {
        it('deletes the item with given key', function() {
            // When
            store.deleteValue('my.key');

            // Then
            expect(storeProvider.deleteItem).to.be.calledWith('my.key');
        });
    });

    describe('hasValue', function() {
        it('with value', function() {
            // Given
            storeProvider.hasValue.withArgs('my.key').returns(true);

            // When
            let hasValue = store.hasValue('my.key');

            // Then
            expect(hasValue).to.be.true();
        });

        it('without value', function() {
            // Given
            storeProvider.hasValue.withArgs('my.key').returns(false);

            // When
            let hasValue = store.hasValue('my.key');

            // Then
            expect(hasValue).to.be.false();
        });
    });
});
