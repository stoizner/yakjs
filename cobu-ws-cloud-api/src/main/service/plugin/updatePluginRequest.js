/**
 * UpdatePluginRequest
 * @constructor
 */
cobu.wsc.service.UpdatePluginRequest = function UpdatePluginRequest() {

    'use strict';

    /**
    * Command for the service API.
    * @type {string}
    */
    this.type = 'request.updatePlugin';

    /**
    * The original Plugin name.
    * @type {null}
    */
    this.pluginName = null;

    /**
    * Unique name of Plugin.
    * @type {string}
    */
    this.name = null;

    /**
    * Some description.
    * @type {string}
    */
    this.description = null;

    /**
    * The plugin code.
    * @type {string}
    */
    this.code = 0;
};