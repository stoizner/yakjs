/**
 * PluginManager
 * @constructor
 * @param {yak.ConfigManager} configManager
 */
yak.PluginManager = function PluginManager(configManager) {

    'use strict';

    /** @type {yak.PluginManager} */
    var self = this;

    /**
     * @type {Object.<string, yak.Plugin>}
     */
    var plugins = {};

    /**
     * @type {yak.Logger}
     */
    var log = new yak.Logger(self.constructor.name);

    /** Constructor */
    function constructor() {
    }

    /**
     * @param {string} name
     * @returns {yak.Plugin}
     */
    this.getPlugin = function getPlugin(name) {
        return plugins[name];
    };

    /**
     * Get list of plugins.
     * @returns {Array.<yak.Plugin>}
     */
    this.getPlugins = function getPlugins() {

        var result = [];

        for(var key in plugins) {
            if (plugins.hasOwnProperty(key)) {
                result.push(plugins[key]);
            }
        }

        log.info(result.length + ' plugins available.');

        return result;
    };

    /**
     * Check if plugin with given name exists.
     * @param {string} name
     */
    this.hasPlugin = function hasPlugin(name) {
        return plugins.hasOwnProperty(name);
    };

    /**
     * @param {yak.Plugin} plugin
     */
    this.addOrUpdatePlugin = function addOrUpdatePlugin(plugin) {

        if (plugin.PluginConstructor === null) {
            plugin.PluginConstructor = createPluginWorkerConstructor(plugin.code);
        }

        if (plugin.PluginConstructor !== null) {
            plugins[plugin.name] = plugin;
            updateAndSaveConfig();
        }
    };

    /**
     * @param {string} name The name of the plugin.
     */
    this.removePlugin = function removePlugin(name) {
        if (plugins.hasOwnProperty(name)) {
            delete plugins[name];
            updateAndSaveConfig();
        }
    };

    /**
     * @param {string} name
     * @return {null|yak.PluginWorker}
     */
    this.createPluginWorker = function createPluginWorker(name) {
        log.info('Create plugin instance: ' + name);
        var pluginWorker = null;

        if (plugins.hasOwnProperty(name)) {
            var plugin = plugins[name];

            try {
                if (typeof plugin.PluginConstructor === 'function') {
                    pluginWorker = new plugin.PluginConstructor();
                    pluginWorker.name = name;
                } else {
                    log.warn('No constructor function available, can not create plugin instance: ' + name + '');
                }
            } catch(ex) {
                pluginWorker = null;
                log.warn('Can not create plugin instance: ' + name + '');
                log.info(ex);
                log.info(ex.stack);
            }
        }

        return pluginWorker;
    };

    /**
     * @param {string} name
     * @param {string} description
     * @param {string} code
     */
    this.createOrUpdatePlugin = function createOrUpdatePlugin(name, description, code) {
        log.info('createOrUpdatePlugin', { name: name, description: description, code: code });

        var plugin = new yak.Plugin();
        plugin.name = name;
        plugin.description = description;
        plugin.code = code;
        plugin.PluginConstructor = createPluginWorkerConstructor(code);

        if (plugin.PluginConstructor !== null) {
            plugins[name] = plugin;
            updateAndSaveConfig();
        }
    };

    /**
     * Creates the constructor function for the worker.
     * @param {string} code
     * @return {Function}
     */
    function createPluginWorkerConstructor(code) {

        var worker = null;

        try {
            // Function is a form of eval, but we are using it here for executing custom plugin code.
            // noinspection JSHint
            worker = new Function('return ' + code)();
        } catch (ex) {
            log.warn(ex);
            log.warn(ex.stack);
        }

        return worker;
    }

    /**
     * Update config and save it.
     */
    function updateAndSaveConfig() {

        configManager.config.plugins = [];

        for(var key in plugins) {
            if (plugins.hasOwnProperty(key)) {
                var plugin = plugins[key];

                var pluginConfigItem = new yak.PluginConfigItem();
                pluginConfigItem.description = plugin.description;
                pluginConfigItem.name = plugin.name;
                pluginConfigItem.code = plugin.code;

                configManager.config.plugins.push(pluginConfigItem);
            }
        }

        configManager.save();
    }

    constructor();
};