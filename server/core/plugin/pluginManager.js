'use strict';

const _ = require('underscore');
const Logger = require('../infrastructure/logger');
const PluginCodeProvider = require('../plugin/pluginCodeProvider');
const PluginParser = require('../plugin/pluginParser');
const PluginValidator = require('../plugin/pluginValidator');
const yakRequire = require('../infrastructure/yakRequire');
const fileExtension = require('../infrastructure/fileExtension');

/**
 * @constructor
 * @struct
 * @param {!PluginCodeProvider} [pluginCodeProvider]
 * @param {!PluginParser} [pluginCodeParser]
 */
function PluginManager(pluginCodeProvider, pluginCodeParser) {
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
     * @type {!PluginCodeProvider}
     */
    let provider = pluginCodeProvider || new PluginCodeProvider();

    /**
     * @type {!PluginParser}
     */
    let parser = pluginCodeParser || new PluginParser();

    /**
     * Load plugins.
     */
    this.loadPlugins = function loadPlugins() {
        let pluginCode = provider.getPluginCode();
        parsePluginCode(pluginCode);

        log.info('Plugins loaded.', {plugins: Object.keys(plugins)});
    };

    /**
     * Read file content and parse it.
     * @param {!Object<string, string>} pluginCode
     */
    function parsePluginCode(pluginCode) {
        _.each(pluginCode, function parse(content, filename) {
            try {
                let plugin = parser.parse(filename, content);
                self.addOrUpdatePlugin(plugin);
            } catch (ex) {
                log.warn('Can not load plugin.', {filename: filename, error: ex.message});
            }
        });
    }

    /**
     * @param {string} id
     * @returns {!Plugin} The plugin.
     */
    this.getPlugin = function getPlugin(id) {
        return plugins[id];
    };

    /**
     * Gets list of plugins.
     * @returns {!Array<!Plugin>} List of plugins.
     */
    this.getPlugins = function getPlugins() {
        let result = [];

        for (let key in plugins) {
            if (plugins.hasOwnProperty(key)) {
                result.push(plugins[key]);
            }
        }

        return result;
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

        existingPlugin = _.extend(existingPlugin, plugin);
        existingPlugin.PluginConstructor = createPluginConstructor(existingPlugin.code);
    };

    /**
     * Change the ID of an existing plugin.
     * @param {string} originalId
     * @param {string} newId
     */
    this.changePluginId = function changedPluginId(originalId, newId) {
        log.info('Change Plugin ID.', {originalId: originalId, newId: newId});

        let existingPlugin = plugins[originalId];

        if (!existingPlugin) {
            throw new Error('Cannot change plugin ID, no plugin found for originalId', {originalId: originalId});
        }

        delete plugins[originalId];

        provider.deletePlugin(originalId);

        existingPlugin.id = newId;
        plugins[newId] = existingPlugin;

        self.savePlugin(existingPlugin);
    };

    /**
     * @param {string} id The id of the plugin.
     */
    this.removePlugin = function removePlugin(id) {
        log.info('Remove plugin instance', {pluginId: id});
        if (plugins.hasOwnProperty(id)) {
            delete plugins[id];
        }

        provider.deletePlugin(id);
    };

    /**
     * Creates a plugin instance.
     * @param {string} pluginId
     * @param {!PluginContext} pluginContext
     * @returns {*} A working plugin instance.
     */
    this.createPluginInstance = function createPluginInstance(pluginId, pluginContext) {
        let pluginLog = new Logger(pluginId + '.plugin');

        let pluginInstance = null;
        let plugin = plugins[pluginId];

        if (plugin) {
            try {
                if (typeof plugin.PluginConstructor === 'function') {
                    let requireContext = _.partial(pluginRequire, {log: pluginLog});

                    pluginContext.require = requireContext;

                    pluginInstance = new plugin.PluginConstructor(requireContext, pluginContext);
                    pluginInstance.pluginId = pluginId;
                } else {
                    pluginLog.error('No constructor function available, can not create plugin instance.');
                }
            } catch (ex) {
                pluginInstance = null;
                pluginLog.error('Can not create plugin instance. Unexpected error.', {error: ex.message});
            }
        } else {
            log.error('Can not create plugin instance. Unknown plugin.', {pluginId: pluginId});
        }

        return pluginInstance;
    };

    /**
     * @param {!FileContainer} fileContainer
     */
    this.upload = function upload(fileContainer) {
        return new Promise((resolve, reject) => {
            let pluginParser = new PluginParser();
            let pluginValidator = new PluginValidator(self);

            let pluginName = fileContainer.filename.replace(fileExtension.PLUGIN_EXTENSION, '');
            let parsedPlugin = pluginParser.parse(pluginName, fileContainer.content);

            if (pluginValidator.isPluginValid(parsedPlugin)) {
                parsedPlugin.version = parsedPlugin.version || '0.1.0';
                parsedPlugin.description = parsedPlugin.description || 'Created via file upload ' + fileContainer.filename;

                self.addOrUpdatePlugin(parsedPlugin);
                self.savePlugin(parsedPlugin);
                resolve();
            } else {
                reject(pluginValidator.getMessage());
            }
        });
    };

    /**
     * Returns the plugin require context.
     * @param {!Object<string, Function|Object>} pluginModules
     * @param {string} moduleId
     * @returns {*} A require function with a plugin context.
     */
    function pluginRequire(pluginModules, moduleId) {
        let module = _.noop;

        log.debug('require module', {moduleId});

        if (_.has(pluginModules, moduleId)) {
            module = pluginModules[moduleId];
        } else {
            module = yakRequire(moduleId);
        }

        if (!module) {
            log.warn('Can not find the required module', {moduleId});
        }

        return module;
    }

    /**
     * Creates the constructor function to create a plugin instance.
     * @param {string} code
     * @returns {Function} The execution function of the plugin.
     */
    function createPluginConstructor(code) {
        let worker = null;

        try {
            // Function is a form of eval, but we are using it here for executing custom plugin code.

            /* eslint-disable no-new-func */
            worker = new Function('return ' + code)();
            /* eslint-enable no-new-func */
        } catch (ex) {
            log.error('No valid plugin code.', {name: ex.name, message: ex.message, line: ex.line});
        }

        return worker;
    }

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
            let pluginString = '';

            let tags = [];

            tags.push({title: 'name', description: plugin.id});
            tags.push({title: 'description', description: plugin.description});
            tags.push({title: 'version', description: plugin.version});
            tags.push({title: 'type', description: plugin.type});

            if (plugin.jsDoc && plugin.jsDoc.tags) {
                tags = tags.concat(plugin.jsDoc.tags);
            }

            tags = _.uniq(tags, function useOnlyUniqueTitles(tag) {
                return tag.title;
            });

            pluginString += '/**';

            _.each(tags, function toJsDocLine(tag) {
                pluginString += ['\n * @', tag.title, ' '].join('');

                if (tag.description) {
                    pluginString += tag.description.replace('\r\n', '\n').replace('\n', '\n * ');
                } else if (tag.name) {
                    pluginString += tag.name.replace('\r\n', '\n').replace('\n', '\n * ');
                }
            });

            pluginString += '\n */\n';
            pluginString += plugin.code;
            pluginString += '\n\n';

            provider.savePlugin(plugin.id, pluginString);
        } catch (ex) {
            log.error('Could not save plugin.', {pluginName: plugin.id, error: ex.message});
        }
    };
}

module.exports = PluginManager;
