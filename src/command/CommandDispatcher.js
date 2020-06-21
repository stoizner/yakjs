'use strict';

const Command = require('./command');

class CommandDispatcher {
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
         * @type {Map<string, !Array<!Command>>}
         */
        this.commandMap = new Map();
    }

    /**
     * Registers a command, it requires a configuration and a context to be executeable.
     * @param {CommandConfig} config
     * @param {PluginContext} context
     */
    register(config, context) {
        this.log.debug('Register command', {name: config.name});

        if (!this.commandMap.has(config.name)) {
            this.commandMap.set(config.name, []);
        }

        this.commandMap.get(config.name).push(new Command(config, context));
    }

    /**
     * Unregisters all commands with given context.
     * @param {!PluginContext} context
     */
    unregisterAllWithContext(context) {
        for(const commandName of this.commandMap.keys()) {
            const commands = this.commandMap.get(commandName).filter(command => command.context !== context);
            this.commandMap.set(commandName, commands);
        }
    }

    /**
     * Gets all registered commands.
     * @param {string} commandName
     * @return {!Array<!Command>}
     */
    getCommands(commandName) {
        return this.commandMap.get(commandName) || [];
    }

    /**
     * Executes all commands with given name.
     * @param {string} commandName
     * @param {?} data
     * @returns {Promise<Array<?>>}
     */
    async execute(commandName, data) {
        const commands = this.getCommands(commandName);

        for(const command of commands) {
            const commandPromise = command.config.execute(data, command.context, command.config);

            if (commandPromise) {
                await commandPromise;
            }
        }
    }
}

module.exports = {CommandDispatcher};
