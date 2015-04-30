/**
 * SetStoreValueRequest
 * @constructor
 * @implements {yak.api.Request}
 */
yak.api.SetStoreValueRequest = function SetStoreValueRequest() {
    /**
     * Command for the service API.
     * @type {string}
     */
    this.type = 'request.setStoreValue';

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
     * The store value.
     * @type {?string}
     */
    this.value = null;
};
