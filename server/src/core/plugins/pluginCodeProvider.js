/**
 * @constructor
 */
yak.PluginCodeProvider = function PluginCodeProvider() {
    'use strict';

    var fs = require('fs');

    /**
     * @type {!yak.PluginCodeProvider}
     */
    var self = this;

    /**
     * @type {string}
     */
    var PLUGINS_DIR = './plugins/';

    /**
     * @type {string}
     */
    var PLUGIN_FILENAME_POSTFIX = '.plugin.js';

    /**
     * @type {yak.Logger}
     */
    var log = new yak.Logger(self.constructor.name);

    /**
     * @returns {!Object<string, string>} Map with all plugin code content.
     */
    this.getPluginCode = function getPluginCode() {
        var files = getAvailablePluginCodeFilenames();
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
        var fullFilename = PLUGINS_DIR + pluginId + PLUGIN_FILENAME_POSTFIX;
        fs.writeFileSync(fullFilename, pluginCode, {encoding: 'utf8'});
    };

    /**
     * Search for plugin files in plugin directory.
     * @returns {!Array<string>} List of plugin code file names found in the PLUGINS_DIR folder.
     */
    function getAvailablePluginCodeFilenames() {
        var files =  fs.readdirSync(PLUGINS_DIR);
        var filenames =  _.filter(files, function useFilesWithPluginPostfix(filename) {
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
        var contentMap = {};

        log.debug('Loading plugins from plugin directory', {dir:PLUGINS_DIR});

        _.each(filenames, function readFile(filename) {
            try {
                var fileContent = fs.readFileSync(PLUGINS_DIR + filename, {encoding: 'utf8'});

                // Clean up windows line endings.
                contentMap[filename] = fileContent.replace('\r\n', '\n');
            } catch(ex) {
                log.warn('Could not read plugin file.', {filename: filename, error: ex.message});
            }
        });

        log.debug('Plugin files read.', {filesRead: _.toArray(contentMap).length});

        return contentMap;
    }
};
