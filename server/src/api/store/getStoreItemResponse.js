/**
 * @constructor
 * @implements {yak.api.Response}
 * @param {string} requestId
 */
yak.api.GetStoreItemResponse = function GetStoreItemResponse(requestId) {
    /**
     * @type {string}
     */
    this.type = 'yak.api.GetStoreItemResponse';

    /**
     * The original request id.
     * @type {string}
     */
    this.requestId = requestId;

    /**
     * The store item.
     * @type {yak.api.StoreItem}
     */
    this.item = null;

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
