/**
 * @constructor
 * @implements {yak.api.Response}
 * @param {string} requestId
 */
yak.api.DeleteInstanceConfigResponse = function DeleteInstanceConfigResponse(requestId) {
    'use strict';

    /**
     * @type {string}
     */
    this.type = 'response.deleteInstanceConfig';

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
