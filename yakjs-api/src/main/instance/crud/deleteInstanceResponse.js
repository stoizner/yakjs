/**
 * RemoveInstanceResponse
 * @constructor
 */
yak.api.DeleteInstanceResponse = function DeleteInstanceResponse() {

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