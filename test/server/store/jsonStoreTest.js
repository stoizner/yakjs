var sandbox = require('../../testSandbox');
var sinon = sandbox.sinon;
var expect = sandbox.expect;

describe('JsonStore', function() {
    'use strict';

    /**
     * @type {!yak.JsonStore}
     */
    var sut;

    /**
     * @type {yak.StoreProvider}
     */
    var storeProvider;

    /**
     * Setup before each test
     */
    beforeEach(function() {
        // Set up stubs
        storeProvider = sinon.stub(new yak.StoreProvider());

        // Set up subject under test.
        sut = new yak.JsonStore(storeProvider)
    });

    describe('set (update or create) a value', function() {
        it('serialize object before setting it as a value.', function() {
            // Given
            var data = {test: 42};

            // When
            sut.setValue('my.key', data);

            // Then
            expect(storeProvider.updateValue).to.be.calledWith('my.key', JSON.stringify(data, null, 4));
        });
    });

    describe('get a value for given key', function() {
        it('return {} when no value was found', function() {
            // When
            var data = sut.getValue('keyWithoutValue');

            // Then
            expect(data).to.be.eql({});
        });

        it('return deserialized object', function() {
            // Given
            var givenData = {test: 42};
            storeProvider.getValue.withArgs('my.key').returns(JSON.stringify(givenData, null, 4));

            // When
            var data = sut.getValue('my.key');

            // Then
            expect(data).to.be.eql(givenData);
        });
    });

    describe('remove value and key from store', function() {
        it('call remove on the provider.', function() {
            // When
            sut.deleteValue('my.key');

            // Then
            expect(storeProvider.deleteValue).to.be.calledWith('my.key');
        });
    });

    describe('check if a value exists for a key', function() {
        it('with value', function() {
            // Given
            storeProvider.hasValue.withArgs('my.key').returns(true);

            // When
            var hasValue = sut.hasValue('my.key');

            // Then
            expect(hasValue).to.be.equal(true);
        });

        it('without value', function() {
            // Given
            storeProvider.hasValue.withArgs('my.key').returns(false);

            // When
            var hasValue = sut.hasValue('my.key');

            // Then
            expect(hasValue).to.be.equal(false);
        });
    });
});
