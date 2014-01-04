/**
 * RemovePluginResponse
 * @constructor
 */
yak.api.DeletePluginResponse = function DeletePluginResponse() {

    'use strict';

    /**
    * Command for the service API.
    * @type {string}
    */
    this.type = 'response.deletePlugin';

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