/**
 * StopInstanceResponse
 * @constructor
 * @implements {yak.api.Response}
 */
yak.api.StopInstanceResponse = function StopInstanceResponse() {
    'use strict';

    /**
     * Command for the service API.
     * @type {string}
     */
    this.type = 'response.stopInstance';

    /**
     * The original request id.
     * @type {null}
     */
    this.requestId = null;

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
