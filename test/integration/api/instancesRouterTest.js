'use strict';

const {expect} = require('../../testSandbox');
const fetch = require('node-fetch');
const {integrationServer} = require('../integrationServer');

describe('instances routes', function() {
    'use strict';

    describe('GET /instances', function() {
        it('returns the list of pre defined instances', async function() {
            // Given
            await fetch(integrationServer.getApiUrl('/instances/instanceA/start'), {method: 'POST'});

            // When
            const response = await fetch(integrationServer.getApiUrl('/instances'));

            // Then
            expect(response.status).to.equal(200);
            const expectedData = {
                instances: [
                    {
                        name: 'Instance A',
                        description: 'Instance Description A',
                        port: 9010,
                        connectionCount: 0,
                        state: 'running',
                        plugins: [
                            'broadcast',
                            'echo'
                        ]
                    }
                ]
            };
            expect(await response.json()).to.deep.equal(expectedData);
        });
    });

    describe('POST /instances/instanceA/start', function() {
        it('starts the instance', async function() {
            // When
            const response = await fetch(integrationServer.getApiUrl('/instances/instanceA/start'), {method: 'POST'});

            // Then
            expect(response.status).to.equal(200);
        });
    });

    describe('POST /instances/instanceA/stop', function() {
        it('stops the instance', async function() {
            // When
            const response = await fetch(integrationServer.getApiUrl('/instances/instanceA/stop'), {method: 'POST'});

            // Then
            expect(response.status).to.equal(200);
        });
    });

    describe('POST /instances/running/restart', function() {
        it('restarts the instance', async function() {
            // When
            const response = await fetch(integrationServer.getApiUrl('/instances/running/restart'), {method: 'POST'});

            // Then
            expect(response.status).to.equal(200);
        });
    });
});
