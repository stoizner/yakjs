import {sinon, expect} from '../../testSandbox.js';
import {JsonStore} from '../../../common/jsonStore.js';

describe('JsonStore', function() {
    'use strict';

    /**
     * @type {!StoreProvider}
     */
    let storeProvider;

    /**
     * @type {!JsonStore}
     */
    let jsonStore;

    beforeEach(function() {
        // Set up stubs
        storeProvider = {
            updateItem: sinon.stub(),
            getValue: sinon.stub(),
            deleteItem: sinon.stub(),
            hasValue: sinon.stub()
        };

        // Create subject under test
        jsonStore = new JsonStore(storeProvider);
    });

    describe('set (update or create) a value', function() {
        it('serialize object before setting it as a value.', function() {
            // Given
            let data = {test: 42};

            // When
            jsonStore.setValue('my.key', data);

            // Then
            expect(storeProvider.updateItem).to.be.calledWith('my.key', JSON.stringify(data, null, 4));
        });
    });

    describe('get a value for given key', function() {
        it('return {} when no value was found', function() {
            // When
            let data = jsonStore.getValue('keyWithoutValue');

            // Then
            expect(data).to.be.eql({});
        });

        it('return deserialized object', function() {
            // Given
            let givenData = {test: 42};
            storeProvider.getValue.withArgs('my.key').returns(JSON.stringify(givenData, null, 4));

            // When
            let data = jsonStore.getValue('my.key');

            // Then
            expect(data).to.be.eql(givenData);
        });
    });

    describe('remove value and key from store', function() {
        it('call remove on the provider.', function() {
            // When
            jsonStore.deleteValue('my.key');

            // Then
            expect(storeProvider.deleteItem).to.be.calledWith('my.key');
        });
    });

    describe('check if a value exists for a key', function() {
        it('with value', function() {
            // Given
            storeProvider.hasValue.withArgs('my.key').returns(true);

            // When
            let hasValue = jsonStore.hasValue('my.key');

            // Then
            expect(hasValue).to.be.equal(true);
        });

        it('without value', function() {
            // Given
            storeProvider.hasValue.withArgs('my.key').returns(false);

            // When
            let hasValue = jsonStore.hasValue('my.key');

            // Then
            expect(hasValue).to.be.equal(false);
        });
    });
});
