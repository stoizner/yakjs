const sandbox = require('../../integrationTestSandbox');
const expect = sandbox.expect;
const request = sandbox.request;

describe('instances routes', function() {
    'use strict';

    beforeEach(function() {
    });

    describe('GET /instances', function() {
        it('returns the list of pre defined instances', function() {
            // When
            let promise = request('/instances');

            // Then
            return promise.then((response, body) => {
                expect(response).to.deep.equal('list of instances');
            });
        });
    });
});
