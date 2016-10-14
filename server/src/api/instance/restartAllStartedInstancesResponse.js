/**
 * @constructor
 * @implements {yak.api.Response}
 * @param {string} requestId
 */
yak.api.RestartAllRunningInstancesResponse = function RestartAllRunningInstancesResponse(requestId) {
    'use strict';

    /**
     * @type {string}
     */
    this.type = 'response.restartAllRunningInstances';

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
