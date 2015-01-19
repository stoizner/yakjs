/**
 * GetStoreKeyInfoResponse
 * @constructor
 * @implements {yak.api.Response}
 */
yak.api.GetStoreKeyInfoResponse = function GetStoreKeyInfoResponse() {
    /**
     * Command for the service API.
     * @type {string}
     */
    this.type = 'response.getStoreKeyInfo';

    /**
     * The original request id.
     * @type {null}
     */
    this.requestId = null;

    /**
     * List of log information.
     * @type {Array.<yak.api.StoreKeyInfo>}
     */
    this.keys = [];
};
