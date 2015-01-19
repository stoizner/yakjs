/**
 * UpdatePluginResponse
 * @constructor
 * @implements {yak.api.Response}
 */
yak.api.UpdatePluginResponse = function UpdatePluginResponse() {
    /**
    * Command for the service API.
    * @type {string}
    */
    this.type = 'response.updatePlugin';

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
