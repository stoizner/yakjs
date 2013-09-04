/**
 * CreatePluginResponse
 * @constructor
 */
cobu.wsc.service.CreatePluginResponse = function CreatePluginResponse() {

    'use strict';

    /**
    * Command for the service API.
    * @type {string}
    */
    this.type = 'response.createPlugin';

    /**
    * Whether the request was successfully or not.
    * @type {boolean}
    */
    this.success = true;

    /**
    * Optional: Message if no success.
    * @type {string}
    */
    this.message = '';
};