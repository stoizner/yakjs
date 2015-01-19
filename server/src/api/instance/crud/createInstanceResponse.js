/**
 * CreateInstanceResponse
 * @constructor
 * @implements {yak.api.Response}
 */
yak.api.CreateInstanceResponse = function CreateInstanceResponse() {
    'use strict';

    /**
     * Command for the service API.
     * @type {string}
     */
    this.type = 'response.createInstance';

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
