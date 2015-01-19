/**
 * GetStoreKeyInfoResponse
 * @constructor
 * @implements {yak.api.Response}
 * @param {string} requestId
 */
yak.api.GetStoreKeyInfoResponse = function GetStoreKeyInfoResponse(requestId) {
    /**
     * Command for the service API.
     * @type {string}
     */
    this.type = 'response.getStoreKeyInfo';

    /**
     * The original request id.
     * @type {string}
     */
    this.requestId = requestId;

    /**
     * List of log information.
     * @type {Array.<yak.api.StoreKeyInfo>}
     */
    this.keys = [];
};
