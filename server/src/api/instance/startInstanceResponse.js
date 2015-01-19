/**
 * StartInstanceResponse
 * @constructor
 * @implements {yak.api.Response}
 */
yak.api.StartInstanceResponse = function StartInstanceResponse() {
    'use strict';

    /**
     * Command for the service API.
     * @type {string}
     */
    this.type = 'response.startInstance';

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
