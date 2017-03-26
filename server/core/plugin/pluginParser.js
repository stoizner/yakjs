'use strict';

const _ = require('underscore');
const doctrine = require('doctrine');
const Logger = require('../infrastructure/logger');
const regexGroup = require('../util/regexGroup');
const Plugin = require('./Plugin');

/**
 * @constructor
 * @struct
 */
function PluginParser() {
    /**
     * @type {!PluginParser}
     */
    const self = this;

    /**
     * @type {!Logger}
     */
    const log = new Logger(self.constructor.name);

    /**
     * Parses the JavaScript plugin code and returns a Plugin
     * @param {string} name The plugin name.
     * @param {string} code The JavaScript code.
     * @returns {!Plugin} The parsed plugin.
     */
    this.parse = function parse(name, code) {
        log.debug('Parse plugin content', {name:name, size: code.length});
        let plugin = new Plugin();

        let rawJsDoc = extractJsDocPart(code);
        let jsdoc = '';

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

        let pluginFunction = extractPluginFunction(code);
        if (!pluginFunction) {
            throw new Error('Missing plugin function. The plugin has to contain a function with a name. The function name has to start with a uppercase letter.');
        }

        plugin.code = pluginFunction.func;

        let info = _.extend({}, plugin);
        delete info.code;
        log.debug('Plugin parsed.', {pluginId: plugin.id});

        return plugin;
    };

    /**
     * @param {string} pluginCode
     * @returns {boolean} Whether the code or content of a plugin has a JsDoc block.
     */
    this.hasJsDoc = function hasJsDoc(pluginCode) {
        return (extractJsDocPart(pluginCode) !== null);
    };

    /**
     * @param {{tags: Array<{title:string, description:string}>}} jsDoc
     * @param {string} tagName
     * @returns {string} The value of a JsDoc tag.
     */
    function getJsDocTagValue(jsDoc, tagName) {
        let value = null;

        let tag = _.findWhere(jsDoc.tags, {title: tagName});

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
        let jsDoc = null;
        let matchedGroups = regexGroup(content, '(\\/\\*\\*[\\S\\s]*\\*/)\\r*\\nfunction');

        if (matchedGroups) {
            jsDoc = matchedGroups[1];
        }

        return jsDoc;
    }

    /**
     * @param {string} content
     * @returns {{name:string, func:string}} The plugin function code from the file content.
     */
    function extractPluginFunction(content) {
        let pluginFunction = null;
        let matchedGroups = regexGroup(content, 'function ([A-Z][A-Za-z]*)[\\s\\S]*');

        if (matchedGroups) {
            pluginFunction = {
                name: matchedGroups[1],
                func: matchedGroups[0]
            };
        }

        return pluginFunction;
    }
}

module.exports = PluginParser;
