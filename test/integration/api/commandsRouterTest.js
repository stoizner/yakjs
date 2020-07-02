'use strict';

import {expect} from '../../testSandbox';
import fetch from 'node-fetch';
import {integrationServer} from '../integrationServer';

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
