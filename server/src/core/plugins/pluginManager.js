/**
 * PluginManager
 * @constructor
 */
yak.PluginManager = function PluginManager() {
    /**
     * @type {yak.PluginManager}
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
     * Filesystem
     */
    var fs = require('fs');

    /**
     * JsDoc parser.
     */
    var doctrine = require('doctrine');

    /**
     * @type {!Object.<string, yak.Plugin>}
     */
    var plugins = {};

    /**
     * @type {yak.Logger}
     */
    var log = new yak.Logger(self.constructor.name);

    /**
     * Load plugins from plugins directory.
     */
    this.loadPlugins = function loadPlugins() {
        log.info('Loading plugins from plugin directory', {dir:PLUGINS_DIR});

        var pluginFilenames = getPluginFilenames();
        log.info('Plugin files found.', {filesFound: pluginFilenames.length, pluginFilenames: pluginFilenames});

        readAndParsePluginFiles(pluginFilenames);
    };

    /**
     * Read file content and parse it.
     * @param {!Array.<string>} filenames
     */
    function readAndParsePluginFiles(filenames) {
        var fileContent = readPluginFiles(filenames);

        _.each(fileContent, function parse(content, filename) {
            try {
                var plugin = self.parsePluginContent(filename, content);
                self.addOrUpdatePlugin(plugin);
            } catch(ex) {
                log.warn('Can not load plugin.', {filename: filename, error: ex.message});
            }
        });
    }

    /**
     * Parse file content to create a plugin.
     * @param {string} name
     * @param {string} content
     * @returns {yak.Plugin} The plugin.
     */
    this.parsePluginContent = function parsePluginContent(name, content) {
        log.debug('Parse plugin content', {name:name, contentSize: content.length});
        var plugin = new yak.Plugin();

        var rawJsDoc = extractJsDocPart(content);
        var jsdoc = '';

        if (rawJsDoc) {
            jsdoc = doctrine.parse(rawJsDoc, {unwrap: true});

            if (!jsdoc) {
                log.warn('Could not parse jsdoc of plugin content.');
            }
        }

        // Id shall not use postfix or js file ending.
        plugin.id = name.replace('.plugin', '').replace('.js', '');

        // This shall be the target way (TODO: Name/ID handling)
        //plugin.name = getJsDocTagValue(jsdoc, 'name');

        // COMPATIBILITY This is currently for intercompatibility
        plugin.name = plugin.id;

        plugin.description = getJsDocTagValue(jsdoc, 'description');
        plugin.version = getJsDocTagValue(jsdoc, 'version');
        plugin.jsDoc = jsdoc;

        var pluginFunction = extractPluginFunction(content);
        if (!pluginFunction) {
            throw new Error('Missing plugin function. The plugin has to contain a function with a name. The function name has to start with a uppercase letter.');
        }

        plugin.code = pluginFunction.func;

        var info = _.extend({}, plugin);
        delete info.code;
        log.debug('Plugin loaded.', {plugin: info});

        return plugin;
    };

    /**
     * @param {{tags: Array.<{title:string, description:string}>}} jsDoc
     * @param {string} tagName
     * @returns {string} The value of a JsDoc tag.
     */
    function getJsDocTagValue(jsDoc, tagName) {
        var value = null;

        var tag = _.findWhere(jsDoc.tags, {title: tagName});

        if (tag) {
            value = tag.description || tag.name;
        }

        return value;
    }

    /**
     * @param {string} content
     * @returns {string} The JsDoc documentation from the file content.
     */
    function extractJsDocPart(content) {
        var jsDoc = null;
        var matchedGroups = yak.global.regexGroup(content, '(\\/\\*\\*[\\S\\s]*\\*/)\\r*\\nfunction');

        if (matchedGroups) {
            jsDoc = matchedGroups[1];
        }

        return jsDoc;
    }

    /**
     * @param {string} codeOrContent
     * @returns {boolean} Whether the code or content of a plugin has a JsDoc block.
     */
    this.hasJsDoc = function hasJsDoc(codeOrContent) {
        return (extractJsDocPart(codeOrContent) !== null);
    };

    /**
     * @param {string} content
     * @returns {{name:string, func:string}} The plugin function code from the file content.
     */
    function extractPluginFunction(content) {
        var pluginFunction = null;
        var matchedGroups = yak.global.regexGroup(content, 'function ([A-Z][A-Za-z]*)[\\s\\S]*');

        if (matchedGroups) {
            pluginFunction = {
                name: matchedGroups[1],
                func: matchedGroups[0]
            };
        }

        return pluginFunction;
    }

    /**
     * @param {!Array.<string>} filenames
     * @returns {!Object.<string, string>} Map with all file content.
     */
    function readPluginFiles(filenames) {
        var contentMap = {};

        _.each(filenames, function readFile(filename) {
            try {
                var fileContent = fs.readFileSync(PLUGINS_DIR + filename, {encoding: 'utf8'});

                // Clean up windows line endings.
                contentMap[filename] = fileContent.replace('\r\n', '\n');
            } catch(ex) {
                log.warn('Could not read plugin file.', {filename: filename, error: ex.message});
            }
        });
        log.info('Plugin files read.', {filesRead: _.toArray(contentMap).length});

        return contentMap;
    }

    /**
     * Search for plugin files in plugin directory.
     * @returns {!Array.<string>} List of plugin filenames found in the PLUGINS_DIR folder.
     */
    function getPluginFilenames() {
        var files =  fs.readdirSync(PLUGINS_DIR);
        var filenames =  _.filter(files, function useFilesWithPluginPostfix(filename) {
            return filename.lastIndexOf(PLUGIN_FILENAME_POSTFIX) === (filename.length - PLUGIN_FILENAME_POSTFIX.length);
        });

        return filenames;
    }

    /**
     * @param {string} id
     * @returns {yak.Plugin} The plugin.
     */
    this.getPlugin = function getPlugin(id) {
        return plugins[id];
    };

    /**
     * Get list of plugins.
     * @returns {Array.<yak.Plugin>} List of plugins.
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
     * @param {yak.Plugin} plugin
     */
    this.addOrUpdatePlugin = function addOrUpdatePlugin(plugin) {
        if (_.has(plugins, plugin.id)) {
            self.updatePlugin(plugin);
        } else {
            self.addPlugin(plugin);
        }
    };

    /**
     * Change the ID of an existing plugin.
     * @param {string} originalId
     * @param {string} newId
     */
    this.changePluginId = function changedPluginId(originalId, newId) {
        log.info('Change Plugin ID.', {originalId: originalId, newId: newId});

        var existingPlugin = plugins[originalId];

        if (!existingPlugin) {
            throw new Error('Cannot change plugin ID, no plugin found for originalId', {originalId: originalId});
        }

        delete plugins[originalId];

        fs.unlinkSync(PLUGINS_DIR + originalId + PLUGIN_FILENAME_POSTFIX);

        existingPlugin.id = newId;
        plugins[newId] = existingPlugin;

        self.savePlugin(existingPlugin);
    };

    /**
     * @param {yak.Plugin} plugin
     */
    this.addPlugin = function addPlugin(plugin) {
        log.info('Add plugin instance', { pluginId: plugin.id });
        plugin.PluginConstructor = createPluginConstructor(plugin.code);
        plugins[plugin.id] = plugin;
    };

    /**
     * @param {yak.Plugin} plugin
     */
    this.updatePlugin = function updatePlugin(plugin) {
        log.info('Update plugin instance', { pluginId: plugin.id });
        var existingPlugin = plugins[plugin.id];

         _.extend(existingPlugin, plugin);
        existingPlugin.PluginConstructor = createPluginConstructor(existingPlugin.code);
    };

    /**
     * @param {string} id The id of the plugin.
     */
    this.removePlugin = function removePlugin(id) {
        log.info('Remove plugin instance', { pluginId: id });
        if (plugins.hasOwnProperty(id)) {
            delete plugins[id];
        }

        fs.unlinkSync(PLUGINS_DIR + id + PLUGIN_FILENAME_POSTFIX);
    };

    /**
     * Creates a plugin instance.
     * @param {string} name
     * @returns {*} A working plugin instance.
     */
    this.createPluginInstance = function createPluginInstance(name) {
        var pluginLog = new yak.Logger(name + '.plugin');
        pluginLog.info('Create new plugin instance');

        var pluginInstance = null;

        if (plugins.hasOwnProperty(name)) {
            var plugin = plugins[name];

            try {
                if (typeof plugin.PluginConstructor === 'function') {
                    var requireContext = _.partial(pluginRequire, {log: pluginLog});
                    pluginInstance = new plugin.PluginConstructor(requireContext);
                    pluginInstance.name = name;
                } else {
                    pluginLog.error('No constructor function available, can not create plugin instance.');
                }
            } catch(ex) {
                pluginInstance = null;
                pluginLog.error('Can not create plugin instance.', {error: ex.message });
            }
        }

        if (!pluginInstance) {
            log.warn('Could not create a new plugin instance. @' + name);
        }

        return pluginInstance;
    };

    /**
     * Returns the plugin require context.
     * @param {!Object<string, Function|Object>} pluginModules
     * @param {string} moduleId
     * @returns {*} A require function with a plugin context.
     */
    function pluginRequire(pluginModules, moduleId) {
        var module = _.noop;

        if (_.has(pluginModules, moduleId)) {
            module = pluginModules[moduleId];
        } else {
            module = yak.require(moduleId);
        }

        return module;
    }

    /**
     * Creates the constructor function to create a plugin instance.
     * @param {string} code
     * @returns {Function} The execution function of the plugin.
     */
    function createPluginConstructor(code) {
        var worker = null;

        try {
            // Function is a form of eval, but we are using it here for executing custom plugin code.

            /*eslint-disable no-new-func */
            worker = new Function('return ' + code)();
            /*eslint-enable no-new-func */
        } catch (ex) {
            log.error('No valid plugin code.', { name: ex.name, message:ex.message, line: ex.line});
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
     * Save a plugin to the file system.
     * @param {yak.Plugin} plugin
     */
    this.savePlugin = function savePlugin(plugin) {
        try {
            var pluginString = '';

            var tags = [];

            tags.push({title: 'name', description: plugin.name});
            tags.push({title: 'description', description: plugin.description});
            tags.push({title: 'version', description: plugin.version});
            tags.push({title: 'type', description: plugin.type});

            if (plugin.jsDoc && plugin.jsDoc.tags) {
                tags = tags.concat(plugin.jsDoc.tags);
            }

            tags = _.uniq(tags, function useOnlyUniqueTitles(tag) { return tag.title; });

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

            var fullFilename = PLUGINS_DIR + plugin.id + PLUGIN_FILENAME_POSTFIX;
            fs.writeFileSync(fullFilename, pluginString, {encoding: 'utf8'});

        } catch(ex) {
            log.error('Could not save plugin to file system.', {pluginName: plugin.name, error: ex.message});
        }
    };
};
