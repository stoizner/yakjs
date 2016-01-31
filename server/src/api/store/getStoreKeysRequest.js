/**
 * @constructor
 * @implements {yak.api.Request}
 */
yak.api.GetStoreKeysRequest = function GetStoreKeysRequest() {
    /**
     * @type {string}
     */
    this.type = 'yak.api.GetStoreKeysRequest';

    /**
     * Create unique request id.
     * @type {string}
     */
    this.id = yak.api.guid();
};
