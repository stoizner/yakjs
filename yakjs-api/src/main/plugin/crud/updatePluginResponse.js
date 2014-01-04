/**
 * UpdatePluginResponse
 * @constructor
 */
yak.api.UpdatePluginResponse = function UpdatePluginResponse() {

    'use strict';

    /**
    * Command for the service API.
    * @type {string}
    */
    this.type = 'response.updatePlugin';

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