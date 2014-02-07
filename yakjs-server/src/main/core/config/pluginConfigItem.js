/**
 * PluginConfigItem
 * @constructor
 */
yak.PluginConfigItem = function PluginConfigItem() {

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
};