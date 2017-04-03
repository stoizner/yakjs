'use strict';

const _ = require('underscore');
const Logger = require('../infrastructure/logger');
const pluginProvider = require('../plugin/pluginProvider');
const fileExtension = require('../infrastructure/fileExtension');
const Plugin = require('./plugin');

/**
 * @constructor
 * @struct
 */
function PluginManager() {
    /**
     * @type {!PluginManager}
     */
    const self = this;

    /**
     * @type {!Object<string, !Plugin>}
     */
    let plugins = {};

    /**
     * @type {!Logger}
     */
    const log = new Logger(self.constructor.name);

    /**
     * Load plugins.
     * @return {!Object<string, !Plugin>}
     */
    this.loadPlugins = function loadPlugins() {
        plugins = pluginProvider.loadPlugins();

        log.info('Plugins loaded.', {plugins: Object.keys(plugins)});
        return plugins;
    };

    /**
     * @param {string} pluginId
     * @returns {!Plugin}
     */
    this.getPlugin = function getPlugin(pluginId) {
        return plugins[pluginId];
    };

    /**
     * Gets list of plugins.
     * @returns {!Array<!Plugin>} List of plugins.
     */
    this.getPlugins = function getPlugins() {
        return Object.keys(plugins).map(key => plugins[key]);
    };

    /**
     * @param {!Plugin} plugin
     */
    this.addOrUpdatePlugin = function addOrUpdatePlugin(plugin) {
        log.debug('Update plugin instance', {pluginId: plugin.id});

        if (!plugins[plugin.id]) {
            plugins[plugin.id] = plugin;
        }

        let existingPlugin = plugins[plugin.id];

        _.extend(existingPlugin, plugin);
    };

    /**
     * Change the ID of an existing plugin.
     * @param {string} originalId
     * @param {string} newId
     */
    this.changePluginId = function changedPluginId(originalId, newId) {
        log.info('Change Plugin ID.', {originalId, newId});

        let existingPlugin = plugins[originalId];

        if (!existingPlugin) {
            throw new Error('Cannot change plugin ID, no plugin found for originalId', {originalId: originalId});
        }

        delete plugins[originalId];

        pluginProvider.deletePlugin(originalId);

        existingPlugin.id = newId;
        plugins[newId] = existingPlugin;

        // self.savePlugin(existingPlugin);
    };

    /**
     * @param {string} name
     */
    this.removePlugin = function removePlugin(name) {
        log.info('Remove plugin instance', {pluginId: name});
        if (plugins.hasOwnProperty(name)) {
            delete plugins[name];
        }

        pluginProvider.deletePlugin(name);
    };

    /**
     * Creates a plugin instance.
     * @param {string} pluginName
     * @param {!PluginContext} pluginContext
     * @returns {*} A working plugin instance.
     */
    this.createPluginWorker = function createPluginWorker(pluginName, pluginContext) {
        let pluginLog = new Logger(pluginName + '.plugin');

        let pluginWorker = null;
        let plugin = plugins[pluginName];

        if (plugin) {
            try {
                if (typeof plugin.createWorker === 'function') {
                    pluginContext.log = pluginLog;
                    pluginWorker = plugin.createWorker(pluginContext);
                    pluginWorker.name = pluginName;
                } else {
                    pluginLog.error('No createWorker function available, can not create plugin worker.');
                }
            } catch (ex) {
                pluginWorker = null;
                pluginLog.error('Can not create plugin worker. Unexpected error.', {error: ex.message});
            }
        } else {
            log.error('Can not create plugin worker. Unknown plugin.', {pluginName});
        }

        return pluginWorker;
    };

    /**
     * @param {!FileContainer} fileContainer
     */
    this.upload = function upload(fileContainer) {
        return new Promise((resolve, reject) => {
            try {
                let pluginId = fileContainer.filename.replace(fileExtension.PLUGIN_EXTENSION, '');
                let plugin = new Plugin();
                plugin.id = pluginId;
                plugin.code = fileContainer.content;
                plugin.description = 'Created via file upload ' + fileContainer.filename;

                self.addOrUpdatePlugin(plugin);
                self.savePlugin(plugin);
                resolve();
            } catch (error) {
                log.error(error);
                reject();
            }
        });
    };

    /**
     * Update config and save it.
     */
    this.savePlugins = function savePlugins() {
        log.info('savePlugins');
        _.each(plugins, function savePlugin(plugin) {
            self.savePlugin(plugin);
        });
    };

    /**
     * Saves a plugin to the file system.
     * @param {!Plugin} plugin
     */
    this.savePlugin = function savePlugin(plugin) {
        try {
            pluginProvider.savePlugin(plugin.id, plugin.code);
        } catch (ex) {
            log.error('Could not save plugin.', {pluginIde: plugin.id, error: ex.message});
        }
    };
}

module.exports = PluginManager;
