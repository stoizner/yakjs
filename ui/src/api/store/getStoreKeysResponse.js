/**
 * @constructor
 * @implements {yak.api.Response}
 */
yak.api.GetStoreKeysResponse = function GetStoreKeysResponse() {
    /**
     * List of log information.
     * @type {Array<yak.api.StoreKeyInfo>}
     */
    this.storeKeys = [];

    /**
     * An error message when request was not successfully.
     * @type {string}
     */
    this.message = '';
};
