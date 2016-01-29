/**
 * GetStoreKeyInfoRequest
 * @constructor
 * @implements {yak.api.Request}
 */
yak.api.GetStoreKeyInfoRequest = function GetStoreKeyInfoRequest() {
    /**

     * @type {string}
     */
    this.type = 'request.getStoreKeyInfo';

    /**
     * Create unique request id.
     * @type {string}
     */
    this.id = yak.api.guid();
};
