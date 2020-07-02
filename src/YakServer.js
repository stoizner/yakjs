'use strict';

const {ExpressServer} = require('./server/ExpressServer');

const {Service} = require('./Service');

const {YakServerConfig} = require('./YakServerConfig');
const {InstanceManager} = require('./instance/InstanceManager');
const {CommandDispatcher} = require('./command/CommandDispatcher');
const {CommandPresetProvider} = require('./command/CommandPresetProvider');

/**
 * @constructor
 * @struct
 */
class YakServer {
    /**
     * Initializes the yakjs server.
     * @param {Partial<YakServerConfig>} [config]
     */
    constructor(config) {
        /**
         * The HTTP express server
         * @type {ExpressServer}
         */
        this.expressServer = null;

        /**
         * @type {Service}
         */
        this.service = new Service();

        const runtimeConfig = Object.assign(new YakServerConfig(), config || {});

        this.service.initialize(runtimeConfig);
        this.service.instanceManager = new InstanceManager(this.service);
        this.service.commandDispatcher = new CommandDispatcher(this.service);

        this.service.commandPresetsProvider = new CommandPresetProvider();
    }

    /**
     * Starts the YAKjs server.
     */
    async start() {
        this.expressServer = new ExpressServer(this.service);
        await this.expressServer.start();
    }

    stop() {
        this.expressServer.stop();
    }

    /**
     *
     * @param {YakInstance} instance
     */
    async addInstance(instance) {
        await this.service.instanceManager.addInstance(instance);

        if (instance.isAutoStartEnabled) {
            await this.service.instanceManager.start(instance.id);
        }
    }
}

module.exports = {YakServer};
