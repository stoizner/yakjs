/**
 * RemovePluginRequest
 * @constructor
 */
cobu.wsc.service.RemovePluginRequest = function RemovePluginRequest() {

    'use strict';

    /**
    * Command for the service API.
    * @type {string}
    */
    this.type = 'request.removePlugin';

    /**
    * Name of the Plugin.
    * @type {string}
    */
    this.pluginName = null;
};