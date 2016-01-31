/**
 * @constructor
 * @implements {yak.api.Request}
 */
yak.api.GetStoreItemRequest = function GetStoreItemRequest() {
    /**
     * @type {string}
     */
    this.type = 'yak.api.GetStoreItemRequest';

    /**
     * Create unique request id.
     * @type {string}
     */
    this.id = yak.api.guid();

    /**
     * Store key
     * @type {?string}
     */
    this.key = null;
};
