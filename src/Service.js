'use strict';

export class Service {
    constructor() {
        /**
         * @type {YakLogger}
         */
        this.log = null;

        /**
         *
         * @type {YakServerConfig}
         */
        this.config = null;

        /**
         * @type {InstanceManager}
         */
        this.instanceManager = null;

        /**
         * @type {CommandPresetProvider}
         */
        this.commandPresetsProvider = null;

        /**
         * @type {CommandDispatcher}
         */
        this.commandDispatcher = null;
    }

    /**
     *
     * @param {YakServerConfig} runtimeConfig
     */
    initialize(runtimeConfig) {
        this.config = runtimeConfig;
        this.log = runtimeConfig.log;
    }
}
