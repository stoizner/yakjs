/**
 * RemovePluginRequest
 * @constructor
 */
yak.api.DeletePluginRequest = function DeletePluginRequest() {

    'use strict';

    /**
    * Command for the service API.
    * @type {string}
    */
    this.type = 'request.deletePlugin';

    /**
    * Name of the Plugin.
    * @type {string}
    */
    this.pluginName = null;
};