/**
 * UpdateInstanceResponse
 * @constructor
 * @implements {yak.api.Response}
 * @param {string} requestId
 */
yak.api.UpdateInstanceResponse = function UpdateInstanceResponse(requestId) {
    /**
    * Command for the service API.
    * @type {string}
    */
    this.type = 'response.updateInstance';

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
