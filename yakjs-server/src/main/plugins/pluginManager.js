/**
 * PluginManager
 * @constructor
 * @param {yak.ConfigManager} configManager
 */
yak.PluginManager = function PluginManager(configManager) {
    'use strict';

    /**
     * @type {yak.PluginManager}
     */
    var self = this;

    /**
     * @type {Object.<string, yak.Plugin>}
     */
    var plugins = {};

    /**
     * @type {yak.Logger}
     */
    var log = new yak.Logger(self.constructor.name);

    /**
     * Constructor
     */
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

        log.info('Available plugins', { count: result.length });

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
            plugin.PluginConstructor = createPluginConstructor(plugin.code);
        }

        if (plugin.PluginConstructor !== null) {
            plugins[plugin.name] = plugin;
            // updateAndSaveConfig();
        }
    };

    /**
     * @param {string} name The name of the plugin.
     */
    this.removePlugin = function removePlugin(name) {
        if (plugins.hasOwnProperty(name)) {
            delete plugins[name];
            // updateAndSaveConfig();
        }
    };

    /**
     * Create a plugin instance.
     * @param {string} name
     * @return {*}
     * @param {function} [require]
     */
    this.createPluginInstance = function createPluginInstance(name, require) {
        log.info('Create plugin instance', { pluginName: name });
        var pluginInstance = null;

        if (plugins.hasOwnProperty(name)) {
            var plugin = plugins[name];

            try {
                if (typeof plugin.PluginConstructor === 'function') {
                    var requireContext = require || yak.require;
                    pluginInstance = new plugin.PluginConstructor(requireContext);
                    pluginInstance.name = name;
                } else {
                    log.warn('No constructor function available, can not create plugin instance. ', { plugin: name });
                }
            } catch(ex) {
                pluginInstance = null;
                log.error('Can not create plugin instance.', { plugin: name, error: ex.message });
                log.debug('Error Stack', { stack: ex.stack });
            }
        }

        return pluginInstance;
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
        plugin.PluginConstructor = createPluginConstructor(code);

        // if (plugin.PluginConstructor !== null) {
        plugins[name] = plugin;
        // updateAndSaveConfig();
        //}
    };

    /**
     * Creates the constructor function to create a plugin instance.
     * @param {string} code
     * @return {Function}
     */
    function createPluginConstructor(code) {

        var worker = null;

        try {
            // Function is a form of eval, but we are using it here for executing custom plugin code.
            // noinspection JSHint
            worker = new Function('return ' + code)();
        } catch (ex) {
            log.error('No valid plugin code.', { name: ex.name, message:ex.message, line: ex.line});
        }

        return worker;
    }

    /**
     * Update config and save it.
     */
    this.updateAndSaveConfig = function updateAndSaveConfig() {

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
    };

    /**
     * Create instances from configuration.
     */
    this.createPluginsFromConfig = function createPluginsFromConfig() {

        configManager.config.plugins.forEach(

            /**
             * @param {yak.PluginConfigItem} pluginConfig
             */
            function(pluginConfig) {
                var plugin = new yak.Plugin();
                plugin.name = pluginConfig.name;
                plugin.description = pluginConfig.description;
                plugin.code = pluginConfig.code;

                self.addOrUpdatePlugin(plugin);
            }
        );
    };

    constructor();
};