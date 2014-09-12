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

        log.debug('pluginFilenames', {pluginFilenames: pluginFilenames});
        readAndParsePluginFiles(pluginFilenames);
    }

    /**
     * Read file content and parse it.
     * @param {!Array.<string>} filenames
     * @returns {!Object.<string, yak.Plugin>}
     */
    function readAndParsePluginFiles(filenames) {
        var fileContent = readPluginFiles(filenames);

        _.each(fileContent, function parse(content, filename) {
            try {
                var plugin = parsePluginFile(filename, content)
                self.addOrUpdatePlugin(plugin);
            } catch(ex) {
                log.warn('Can not load plugin.', {filename: filename, error: ex.message});
            }
        });
    }

    /**
     * Parse file content to plugin
     * @param {string} filename
     * @param {string} content
     * @return {yak.Plugin}
     */
    function parsePluginFile(filename, content) {
        var plugin = new yak.Plugin();

        var rawJsDoc = extractJsDocPart(content);
        if (!rawJsDoc) {
            throw new Error('Missing plugin JsDoc documentation. Use JsDoc to document your plugin.');
        }

        var jsdoc = doctrine.parse(rawJsDoc, {unwrap: true});
        if (!jsdoc) {
            throw new Error('Can not parse JsDoc comments.');
        }

        plugin.name = getJsDocTagValue(jsdoc, 'name');
        plugin.description = getJsDocTagValue(jsdoc, 'description');
        plugin.version = getJsDocTagValue(jsdoc, 'version');
        plugin.filename = filename;
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
    }

    /**
     *
     * @param {{tags: Array.<{title:string, description:string}>}} jsDoc
     * @param {string} tagName
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
     * @returns {string}
     */
    function extractJsDocPart(content) {
        var jsDoc = null;
        var matchedGroups = yak.util.regexGroup(content, '(\\/\\*\\*[\\S\\s]*\\*/)\\r*\\nfunction');

        if (matchedGroups) {
            jsDoc = matchedGroups[1];
        }

        return jsDoc;
    }

    /**
     * @param {string} content
     * @returns {{name:string, func:string}}
     */
    function extractPluginFunction(content) {
        var pluginFunction = null;
        var matchedGroups = yak.util.regexGroup(content, 'function ([A-Z][A-Za-z]*)[^$]*');

        if (matchedGroups) {
            pluginFunction = {
                name: matchedGroups[1],
                func: matchedGroups[0]
            }
        }

        return pluginFunction;
    }

    /**
     * @param {!Array.<string>} filenames
     * @returns {!Object.<string, string>}
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
        log.debug('readPluginFiles', {filesRead: _.toArray(contentMap).length});

        return contentMap;
    }

    /**
     * Search for plugin files in plugin directory.
     * @returns {!Array.<string>}
     */
    function getPluginFilenames() {
        var files =  fs.readdirSync(PLUGINS_DIR)
        var filenames =  _.filter(files, function useFilesWithJsEnding(filename) {
            return filename.lastIndexOf('.js') === (filename.length - 3);
        })

        return filenames;
    }

    /**
     * @param {string} name
     * @returns {yak.Plugin} The plugin.
     */
    this.getPlugin = function getPlugin(name) {
        return plugins[name];
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
     * Check if plugin with given name exists.
     * @param {string} name
     * @returns {boolean} Whether plugin with given name exists or not.
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
            // savePlugin();
        }
    };

    /**
     * @param {string} name The id of the plugin.
     */
    this.removePlugin = function removePlugin(name) {
        if (plugins.hasOwnProperty(name)) {
            delete plugins[name];
            // savePlugin();
        }
    };

    /**
     * Create a plugin instance.
     * @param {string} name
     * @param {function} [require]
     * @returns {*} The plugin worker.
     */
    this.createPluginInstance = function createPluginInstance(name, require) {
        log.info('Create plugin instance', { pluginId: name });
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
        // savePlugin();
        //}
    };

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
            savePluginToFile(plugin);
        });
    };

    /**
     * Save a plugin to the file system.
     * @param {yak.Plugin} plugin
     */
    function savePluginToFile(plugin) {
        try {
            var pluginString = ''

            var tags = [];

            tags.push({title: 'name', description: plugin.name});
            tags.push({title: 'description', description: plugin.description});
            tags.push({title: 'version', description: plugin.version});
            tags.push({title: 'type', description: plugin.type});

            if (plugin.jsDoc && plugin.jsDoc.tags) {
                tags = tags.concat(plugin.jsDoc.tags);
            }

            // Create jsdoc part
            pluginString += '/**';


            _.each(tags, function toJsDocLine(tag) {
                pluginString += ['\n * @', tag.title, ' '].join('');

                if (tag.description) {
                    pluginString += tag.description.replace('\r\n', '\n').replace('\n', '\n * ');
                } else if (tag.name) {
                    pluginString += tag.name.replace('\r\n', '\n').replace('\n', '\n * ');
                }
            })

            pluginString += '\n */\n';
            // Add code.
            pluginString += plugin.code;

            var filename = plugin.name.replace(' ', '-');

            fs.writeFileSync(PLUGINS_DIR + filename + '.js', pluginString, {encoding: 'utf8'});

        } catch(ex) {
            log.error('Could not save plugin to file system.', {pluginName: plugin.name, error: ex.message});
        }
    }
};
