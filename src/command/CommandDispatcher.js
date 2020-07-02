'use strict';

import {CommandWorker} from './CommandWorker.js';

export class CommandDispatcher {
    /**
     * @param {Service} service
     */
    constructor(service) {
        /**
         * @type {YakLogger}
         */
        this.log = service.log;

        /**
         * The key is the command name.
         * @type {Map<string, Array<CommandWorker>>}
         */
        this.commandMap = new Map();
    }

    /**
     * Registers a command, it requires a configuration and a context to be executeable.
     * @param {YakPluginCommand} command
     * @param {PluginContext} context
     */
    register(command, context) {
        this.log.debug('Register command', {name: command.name});

        if (!this.commandMap.has(command.name)) {
            this.commandMap.set(command.name, []);
        }

        this.commandMap.get(command.name).push(new CommandWorker(command, context));
    }

    /**
     * Unregisters all commands with given context.
     * @param {!PluginContext} context
     */
    unregisterAllWithContext(context) {
        for(const commandName of this.commandMap.keys()) {
            const commands = this.commandMap.get(commandName).filter(command => command.pluginContext !== context);
            this.commandMap.set(commandName, commands);
        }
    }

    /**
     * @param {string} commandName
     * @return {Array<CommandWorker>}
     */
    getCommandWorkers(commandName) {
        return this.commandMap.get(commandName) || [];
    }

    /**
     * Executes all commands with given name.
     * @param {string} commandName
     * @returns {Promise<Array<?>>}
     */
    async execute(commandName) {
        const commandWorkers = this.getCommandWorkers(commandName);

        for(const worker of commandWorkers) {
            const data = worker.command.data || worker.command.exampleData;
            const commandPromise = worker.command.execute(data, worker.pluginContext, worker.command);

            if (commandPromise) {
                await commandPromise;
            }
        }
    }
}
