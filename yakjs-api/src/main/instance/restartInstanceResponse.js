/**
 * RestartInstanceResponse
 * @constructor
 */
yak.api.RestartInstanceResponse = function RestartInstanceResponse() {

    'use strict';

    /**
     * Command for the service API.
     * @type {string}
     */
    this.type = 'response.restartInstance';

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