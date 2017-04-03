'use strict';

const Logger = require('../infrastructure/logger');
const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const fileExtension = require('../infrastructure/fileExtension');

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
     * Saves plugin code.
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
        let files = fs.readdirSync(PLUGINS_DIR);
        let filenames = _.filter(files, function useFilesWithPluginPostfix(filename) {
            return filename.lastIndexOf(fileExtension.PLUGIN_EXTENSION) === (filename.length - fileExtension.PLUGIN_EXTENSION.length);
        });

        log.debug('Plugin files found.', {filesFound: filenames.length, pluginFilenames: filenames});

        return filenames;
    }

    /**
     * @param {!Array<string>} filenames
     * @returns {!Object<string, !Plugin>}
     */
    function loadPluginsFromFiles(filenames) {
        let plugins = {};

        log.debug('Loading plugins from plugin directory', {dir: PLUGINS_DIR});

        _.each(filenames, function loadPlugin(filename) {
            try {
                let pluginId = toPluginId(filename);

                /* eslint-disable global-require */
                const modulePath = path.normalize('../../' + PLUGINS_DIR + filename);
                delete require.cache[require.resolve(modulePath)];
                let plugin = require(modulePath);
                /* eslint-enable global-require */

                plugin.id = pluginId;
                plugin.code = fs.readFileSync(PLUGINS_DIR + filename, 'utf8');

                plugins[pluginId] = plugin;
            } catch (ex) {
                log.warn('Could not read plugin file.', {filename: filename, error: ex.message});
            }
        });

        log.debug('Plugin files read.', {filesReadCount: Object.keys(plugins).length});

        return plugins;
    }

    /**
     *
     * @param {string} filename
     * @returns {string}
     */
    function toPluginId(filename) {
        return filename.substring(0, filename.lastIndexOf(fileExtension.PLUGIN_EXTENSION));
    }
}

module.exports = new PluginProvider();
