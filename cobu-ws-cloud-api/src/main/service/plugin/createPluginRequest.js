/**
 * CreatePluginRequest
 * @constructor
 */
cobu.wsc.service.CreatePluginRequest = function CreatePluginRequest() {

    'use strict';

    /**
    * Command for the service API.
    * @type {string}
    */
    this.type = 'request.createPlugin';

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
    * Plugin Code.
    * @type {string}
    */
    this.code = null;
};