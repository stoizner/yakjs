/**
 * Plugin
 * @constructor
 */
yak.Plugin = function Plugin() {
    'use strict';

    /**
     * Name of the plugin (Has to be unique)
     * @type {null|string}
     */
    this.name = null;

    /**
     * Description of the plugin.
     * @type {null|string}
     */
    this.description = null;

    /**
     * @type {null|string}
     */
    this.code = null;

    /**
     * Constructor to create a plugin instance.
     * @type {null|Function}
     * @implements {yak.PluginWorker}
     */
    this.PluginConstructor = null;
};