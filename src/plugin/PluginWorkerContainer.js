/* eslint-disable no-empty-function, no-unused-vars */

/**
 * @implements {PluginWorker}
 */
export class PluginWorkerContainer {
    /**
     * @param {YakPlugin} yakPlugin
     */
    constructor(yakPlugin) {
        /**
         * @type {YakPlugin}
         */
        this.yakPlugin = yakPlugin;

        /**
         * inheritDoc
         */
        this.onStart = () => {};

        /**
         * inheritDoc
         */
        this.onInstanceStarted = () => {};

        /**
         * inheritDoc
         */
        this.onNewConnection = () => {};

        /**
         * inheritDoc
         */
        this.onMessage = () => {};

        /**
         * inheritDoc
         */
        this.onJsonMessage = () => {};

        /**
         * @inheritDoc
         */
        this.onConnectionClosed = () => {};

        /**
         * inheritDoc
         */
        this.onStop = () => {};
    }
}
