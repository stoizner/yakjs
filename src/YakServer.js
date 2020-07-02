'use strict';

import {ExpressServer} from './server/ExpressServer.js';
import {Service} from './Service.js';
import {YakServerConfig} from './YakServerConfig.js';
import {InstanceManager} from './instance/InstanceManager.js';
import {CommandDispatcher} from './command/CommandDispatcher.js';

/**
 * @constructor
 * @struct
 */
export class YakServer {
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
