/**
 * CreateOrUpdatePluginRequest
 * @constructor
 */
yak.api.CreateOrUpdatePluginRequest = function CreateOrUpdatePluginRequest() {

    'use strict';

    /**
    * Command for the service API.
    * @type {string}
    */
    this.type = 'request.createOrUpdatePlugin';

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