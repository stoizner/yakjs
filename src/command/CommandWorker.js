'use strict';

/**
 * @constructor
 * @struct
 */
class CommandWorker {
    /**
     * @param {YakPluginCommand} command
     * @param {PluginContext} pluginContext
     */
    constructor(command, pluginContext) {
        /**
         * @type {YakPluginCommand}
         */
        this.command = command

        /**
         * @type {PluginContext}
         */
        this.pluginContext = pluginContext;
    }
}

module.exports = {CommandWorker};
