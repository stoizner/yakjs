'use strict';

const Logger = require('../infrastructure/logger');
const fs = require('fs');
const _ = require('underscore');

/**
 * @constructor
 * @struct
 */
function PluginCodeProvider() {
    /**
     * @type {!PluginCodeProvider}
     */
    const self = this;

    /**
     * @type {string}
     */
    const PLUGINS_DIR = './plugins/';

    /**
     * @type {string}
     */
    const PLUGIN_FILENAME_POSTFIX = '.plugin.js';

    /**
     * @type {!Logger}
     */
    const log = new Logger(self.constructor.name);

    /**
     * @returns {!Object<string, string>} Map with all plugin code content.
     */
    this.getPluginCode = function getPluginCode() {
        let files = getAvailablePluginCodeFilenames();
        return loadPluginFiles(files);
    };

    /**
     * Deletes a plugin.
     * @param {string} pluginId
     */
    this.deletePlugin = function deletePlugin(pluginId) {
        fs.unlinkSync(PLUGINS_DIR + pluginId + PLUGIN_FILENAME_POSTFIX);
    };

    /**
     * Saves plugin code.
     * @param {string} pluginId
     * @param {string} pluginCode
     */
    this.savePlugin = function savePlugin(pluginId, pluginCode) {
        let fullFilename = PLUGINS_DIR + pluginId + PLUGIN_FILENAME_POSTFIX;
        fs.writeFileSync(fullFilename, pluginCode, {encoding: 'utf8'});
    };

    /**
     * Search for plugin files in plugin directory.
     * @returns {!Array<string>} List of plugin code file names found in the PLUGINS_DIR folder.
     */
    function getAvailablePluginCodeFilenames() {
        let files =  fs.readdirSync(PLUGINS_DIR);
        let filenames =  _.filter(files, function useFilesWithPluginPostfix(filename) {
            return filename.lastIndexOf(PLUGIN_FILENAME_POSTFIX) === (filename.length - PLUGIN_FILENAME_POSTFIX.length);
        });

        log.debug('Plugin files found.', {filesFound: filenames.length, pluginFilenames: filenames});

        return filenames;
    }

    /**
     * @param {!Array<string>} filenames
     * @returns {!Object<string, string>} The content of every file.
     */
    function loadPluginFiles(filenames) {
        let contentMap = {};

        log.debug('Loading plugins from plugin directory', {dir:PLUGINS_DIR});

        _.each(filenames, function readFile(filename) {
            try {
                let fileContent = fs.readFileSync(PLUGINS_DIR + filename, {encoding: 'utf8'});

                // Clean up windows line endings.
                contentMap[filename] = fileContent.replace('\r\n', '\n');
            } catch(ex) {
                log.warn('Could not read plugin file.', {filename: filename, error: ex.message});
            }
        });

        log.debug('Plugin files read.', {filesRead: _.toArray(contentMap).length});

        return contentMap;
    }
}

module.exports = PluginCodeProvider;
