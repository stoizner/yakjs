/**
 * @constructor
 * @implements {yak.api.Response}
 * @param {string} requestId
 */
yak.api.GetModuleNamesResponse = function GetModuleNamesResponse(requestId) {
    /**
    * Command for the service API.
    * @type {string}
    */
    this.type = 'response.getModuleNames';

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
     * List of all available module names.
     * @type {!Array<string>}
     */
    this.moduleNames = [];
};
