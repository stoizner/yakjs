/**
 * RemoveInstanceResponse
 * @constructor
 */
cobu.wsc.service.RemoveInstanceResponse = function RemoveInstanceResponse() {

    'use strict';

    /**
    * Command for the service API.
    * @type {string}
    */
    this.type = 'response.removeInstance';

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