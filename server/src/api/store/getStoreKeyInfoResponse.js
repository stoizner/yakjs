/**
 * GetStoreKeyInfoResponse
 * @constructor
 * @implements {yak.api.Response}
 * @param {string} requestId
 */
yak.api.GetStoreKeyInfoResponse = function GetStoreKeyInfoResponse(requestId) {
    /**

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
     * @type {Array<yak.api.StoreKeyInfo>}
     */
    this.keys = [];

    /**
     * @type {boolean}
     */
    this.success = true;

    /**
     * An error message when request was not successfully.
     * @type {string}
     */
    this.message = '';
};
