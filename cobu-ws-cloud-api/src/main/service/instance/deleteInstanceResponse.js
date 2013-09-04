/**
 * DeleteInstanceResponse
 * @constructor
 */
cobu.wsc.service.DeleteInstanceResponse = function DeleteInstanceResponse() {

    'use strict';

    /**
    * Command for the service API.
    * @type {string}
    */
    this.type = 'response.deleteInstance';

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