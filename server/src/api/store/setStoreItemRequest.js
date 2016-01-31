/**
 * @constructor
 * @implements {yak.api.Request}
 */
yak.api.SetStoreItemRequest = function SetStoreItemRequest() {
    /**
     * @type {string}
     */
    this.type = 'yak.api.SetStoreItemRequest';

    /**
     * Create unique request id.
     * @type {string}
     */
    this.id = yak.api.guid();

    /**
     * The store key.
     * @type {?string}
     */
    this.key = null;

    /**
     * The store item.
     * @type {yak.api.StoreItem}
     */
    this.item = null;
};
