'use strict';

const log = require('../infrastructure/logger').defaultLogger;
const pluginLog = require('../infrastructure/logger').pluginLogger;
const pluginProvider = require('../plugin/pluginProvider');
const fileExtension = require('../infrastructure/fileExtension');

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
     * @param {string} pluginId
     * @param {string} pluginCode
     */
    this.addOrUpdatePlugin = function addOrUpdatePlugin(pluginId, pluginCode) {
        log.debug('Add or update plugin instance', {pluginId: pluginId});

        pluginProvider.savePlugin(pluginId, pluginCode);

        delete plugins[pluginId];
        let plugin = pluginProvider.loadPluginById(pluginId);

        if (pluginId) {
            plugins[pluginId] = plugin;
        }
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
        let pluginWorker = null;
        let plugin = plugins[pluginName];

        if (plugin) {
            try {
                if (plugin.module) {
                    if (typeof plugin.module.createWorker === 'function') {
                        pluginContext.log = pluginLog;
                        pluginWorker = plugin.module.createWorker(pluginContext);
                        pluginWorker.name = pluginName;
                    } else {
                        pluginLog.error('No createWorker function available, can not create plugin worker.');
                    }
                } else {
                    pluginLog.error('Bad YAK. A yak lost a plugin module.');
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

                self.addOrUpdatePlugin(pluginId, fileContainer.content);
                let plugin = pluginProvider.loadPluginById(pluginId);

                if (pluginId) {
                    plugins[pluginId] = plugin;
                }

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
        plugins.forEach(plugin => self.savePlugin(plugin));
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
