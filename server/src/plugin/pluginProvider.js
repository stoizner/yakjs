'use strict';

const Logger = require('../infrastructure/logger');
const fs = require('fs');
const path = require('path');
const fileExtension = require('../infrastructure/fileExtension');
const Plugin = require('./plugin');

/**
 * @constructor
 * @struct
 */
function PluginProvider() {
    /**
     * @type {!PluginProvider}
     */
    const self = this;

    /**
     * @type {string}
     */
    const PLUGINS_DIR = './plugins/';

    /**
     * @type {!Logger}
     */
    const log = new Logger(self.constructor.name);

    /**
     * @returns {!Object<string, !Plugin>}
     */
    this.loadPlugins = function loadPlugins() {
        let files = getAvailablePluginFilenames();
        return loadPluginsFromFiles(files);
    };

    /**
     * Deletes a plugin.
     * @param {string} pluginId
     */
    this.deletePlugin = function deletePlugin(pluginId) {
        fs.unlinkSync(PLUGINS_DIR + pluginId + fileExtension.PLUGIN_EXTENSION);
    };

    /**
     * Saves plugin definition.
     * @param {string} pluginId
     * @param {string} pluginCode
     */
    this.savePlugin = function savePlugin(pluginId, pluginCode) {
        let fullFilename = PLUGINS_DIR + pluginId + fileExtension.PLUGIN_EXTENSION;
        fs.writeFileSync(fullFilename, pluginCode, {encoding: 'utf8'});
    };

    /**
     * Search for plugin files in plugin directory.
     * @returns {!Array<string>} List of plugin code file names found in the PLUGINS_DIR folder.
     */
    function getAvailablePluginFilenames() {
        let filenames = fs.readdirSync(PLUGINS_DIR);
        let pluginFilenames = filenames.filter(isPluginFile);

        log.debug('Plugin files found.', {filesFound: pluginFilenames.length, pluginFilenames: pluginFilenames});

        return pluginFilenames;
    }

    /**
     * @param {!Array<string>} filenames
     * @returns {!Object<string, !Plugin>}
     */
    function loadPluginsFromFiles(filenames) {
        let plugins = {};

        log.debug('Loading plugins from plugin directory', {dir: PLUGINS_DIR});

        filenames.forEach(filename => {
            var plugin = self.loadPlugin(filename);
            if (plugin) {
                plugins[plugin.id] = plugin;
            }
        });

        log.debug('Plugin files read.', {filesReadCount: Object.keys(plugins).length});

        return plugins;
    }

    /**
     * @param {string} filename
     * @returns {Plugin}
     */
    this.loadPlugin = function loadPlugin(filename) {
        let plugin = null;

        try {
            plugin = new Plugin();
            plugin.module = self.loadPluginModule(filename);
            plugin.id = toPluginId(filename);
            plugin.code = fs.readFileSync(PLUGINS_DIR + filename, 'utf8');
        } catch (ex) {
            plugin = null;
            log.warn('Could not read plugin file.', {filename: filename, error: ex.message});
        }

        return plugin;
    };

    /**
     * @param {string} pluginId
     * @returns {Plugin}
     */
    this.loadPluginById = function loadPluginById(pluginId) {
        let plugin = null;
        let filename = pluginId + fileExtension.PLUGIN_EXTENSION;

        try {
            plugin = new Plugin();
            plugin.module = self.loadPluginModule(filename);
            plugin.id = toPluginId(filename);
            plugin.code = fs.readFileSync(PLUGINS_DIR + filename, 'utf8');
        } catch (ex) {
            log.warn('Could not load plugin', {filename: filename, error: ex.message});
        }

        return plugin;
    };

    /**
     * @param {string} filename
     */
    this.loadPluginModule = function loadPluginModule(filename) {
        const modulePath = path.normalize('../../' + PLUGINS_DIR + filename);

        delete require.cache[require.resolve(modulePath)];

        var pluginModule = {};

        try {
            /* eslint-disable global-require */
            pluginModule = require(modulePath);
            /* eslint-enable global-require */
        } catch (ex) {
            var pluginLog = new Logger(toPluginId(filename) + '.plugin');

            log.warn('Could not load plugin module', {ex: ex.message});
            pluginLog.error('Could not load plugin module', {ex: ex.message});

            if (ex.message.indexOf('\'./common') >= 0) {
                pluginLog.error('Use two dots, like ../common/ to load a common module.');
            }

            if (ex.message.indexOf('\'./module') >= 0) {
                pluginLog.error('Use two dots, like ../modules/ to load a module.');
            }
        }

        return pluginModule;
    };

    /**
     * @param {string} filename
     * @returns {string}
     */
    function toPluginId(filename) {
        return filename.substring(0, filename.lastIndexOf(fileExtension.PLUGIN_EXTENSION));
    }

    /**
     * @param {string} filename
     * @returns {boolean}
     */
    function isPluginFile(filename) {
        return filename.lastIndexOf(fileExtension.PLUGIN_EXTENSION) === (filename.length - fileExtension.PLUGIN_EXTENSION.length);
    }
}

module.exports = new PluginProvider();
