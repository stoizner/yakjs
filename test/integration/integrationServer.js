'use strict';

import {YakServer} from '../../src/YakServer.js';
import {YakInstance} from '../../src/YakInstance.js';
import echoPlugin from '../../plugins/echoPlugin.js';
import pingPongPlugin from '../../plugins/pingPongPlugin.js';
import broadCastPlugin from '../../plugins/broadcastPlugin.js';
import integrationServerConfig from './integrationServerConfig.js';

class IntegrationServer {
    constructor() {
        this.server = null;
    }

    async start() {
        this.server = new YakServer({
            port: integrationServerConfig.port
        });

        const instanceA = new YakInstance({
            id: 'instanceA',
            name: 'Broadcast instance',
            description: 'Instance Description A',
            port: 9010,
            isAutoStartEnabled: true,
            plugins: [
                broadCastPlugin
            ]
        });

        const instanceB = new YakInstance({
            id: 'instanceB',
            name: 'Parrot Instance',
            description: 'Uses multiple plugins',
            port: 9020,
            isAutoStartEnabled: true,
            plugins: [
                echoPlugin,
                pingPongPlugin
            ]
        });

        await this.server.addInstance(instanceA);
        await this.server.addInstance(instanceB);
        await this.server.start();
    }

    async stop() {
        await this.server.stop();
    }

    /**
     * @param {string} apiRoute
     * @returns {string}
     */
    getApiUrl(apiRoute) {
        if (!apiRoute.startsWith('/')) {
            throw new Error('The API route needs to start with "/".')
        }

        return `http://localhost:${integrationServerConfig.port}/v2${apiRoute}`;
    }
}

export const integrationServer = new IntegrationServer();
