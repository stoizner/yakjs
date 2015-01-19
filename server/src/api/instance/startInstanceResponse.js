/**
 * StartInstanceResponse
 * @constructor
 * @implements {yak.api.Response}
 * @param {string} requestId
 */
yak.api.StartInstanceResponse = function StartInstanceResponse(requestId) {
    'use strict';

    /**
     * Command for the service API.
     * @type {string}
     */
    this.type = 'response.startInstance';

    /**
     * The original request id.
     * @type {string}
     */
    this.requestId = requestId;

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
