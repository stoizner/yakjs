/**
 * GetStoreValueResponse
 * @constructor
 */
yak.api.GetStoreValueResponse = function GetStoreValueResponse() {
    /**
     * Command for the service API.
     * @type {string}
     */
    this.type = 'response.getStoreValue';

    /**
     * The original request id.
     * @type {null}
     */
    this.requestId = null;

    /**
     * The store key.
     * @type {?string}
     */
    this.key = null;

    /**
     * The key-value pair description.
     * @type {null}
     */
    this.description = null;

    /**
     * The store value.
     * @type {?string}
     */
    this.value = null;
};
