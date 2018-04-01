'use strict';

const Command = require('./command');
const Logger = require('../infrastructure/logger');

/**
 * @type {!Logger}
 */
const log = new Logger('commandDispatcher');

/**
 * Command index, the key is the command name.
 * @type {!Object<string, !Array<!Command>>}
 */
var commandIndex = {};

/**
 * Registers a command, it requires a configuration and a context to be executeable.
 * @param {!CommandConfig} config
 * @param {!PluginContext} context
 */
function register(config, context) {
    log.debug('Register command', {name: config.name});

    if (!commandIndex[config.name]) {
        commandIndex[config.name] = [];
    }

    commandIndex[config.name].push(new Command(config, context));
}

/**
 * Unregisters all commands with given context.
 * @param {!PluginContext} context
 */
function unregisterAllWithContext(context) {
    Object
        .keys(commandIndex)
        .forEach(name => {
            commandIndex[name] = commandIndex[name].filter(command => command.context !== context);
        });
}

/**
 * Unregisters all commands.
 */
function unregisterAll() {
    commandIndex = {};
}

/**
 * Gets all registered commands.
 * @param {string} commandName
 * @return {!Array<!Command>}
 */
function getCommands(commandName) {
    return commandIndex[commandName] || [];
}

/**
 * Executes all commands with given name.
 * @param {string} commandName
 * @param {?} data
 * @returns {Promise<Array<?>>}
 */
function execute(commandName, data) {
    var commands = getCommands(commandName);

    var promises = commands.map(command => {
        var commandPromise;

        if (command.config.execute && command.context) {
            commandPromise = command.config.execute(data, command.context, command.config) || Promise.resolve();
        } else {
            commandPromise = Promise.resolve();
        }

        return commandPromise;
    });

    return Promise.all(promises);
}

module.exports = {
    execute,
    getCommands,
    register,
    unregisterAll,
    unregisterAllWithContext
};
