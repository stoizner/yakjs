'use strict';

const {expect} = require('../../testSandbox');
const fetch = require('node-fetch');
const {integrationServer} = require('../integrationServer');

describe('instances routes', function () {
    'use strict';

    describe('GET /commands', function () {
        it('returns the list of commands from started instances', async function () {
            // Given
            await fetch(integrationServer.getApiUrl('/instances/instanceA/start'), {method: 'POST'});

            // When
            const response = await fetch(integrationServer.getApiUrl('/commands'));

            // Then
            expect(response.status).to.equal(200);
            const expectedData = {
                commands: [{
                        data: {
                            message: 'Hello World'
                        },
                        description: 'Send a message to all connected clients',
                        displayName: 'Broadcast',
                        instanceId: 'instanceA',
                        name: 'broadcast',
                        pluginName: 'broadcast'
                }]
            };
            expect(await response.json()).to.deep.equal(expectedData);
        });
    });
});
