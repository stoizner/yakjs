'use strict';

const {YakServer} = require('../../src/YakServer');
const {YakInstance} = require('../../src/YakInstance')
const echoPlugin = require('../../plugins/echoPlugin');
const pingPongPlugin = require('../../plugins/pingPongPlugin');
const broadCastPlugin = require('../../plugins/broadcastPlugin');
const integrationServerConfig = require('./integrationServerConfig');

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

const integrationServer = new IntegrationServer();

module.exports = {integrationServer};
