/**
 * @constructor
 * @implements {yak.api.Request}
 * @param {string} key The key of the store item to delete.
 */
yak.api.DeleteStoreItemRequest = function DeleteStoreItemRequest(key) {
    /**
     * @type {string}
     */
    this.type = 'yak.api.DeleteStoreItemRequest';

    /**
     * Create unique request id.
     * @type {string}
     */
    this.id = yak.api.guid();

    /**
     * Store key
     * @type {string}
     */
    this.key = key;
};
