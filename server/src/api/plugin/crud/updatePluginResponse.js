/**
 * UpdatePluginResponse
 * @constructor
 * @implements {yak.api.Response}
 * @param {string} requestId
 */
yak.api.UpdatePluginResponse = function UpdatePluginResponse(requestId) {
    /**
    * Command for the service API.
    * @type {string}
    */
    this.type = 'response.updatePlugin';

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
