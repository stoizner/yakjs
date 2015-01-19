/**
 * GetStoreValueResponse
 * @constructor
 * @implements {yak.api.Response}
 * @param {string} requestId
 */
yak.api.GetStoreValueResponse = function GetStoreValueResponse(requestId) {
    /**
     * Command for the service API.
     * @type {string}
     */
    this.type = 'response.getStoreValue';

    /**
     * The original request id.
     * @type {string}
     */
    this.requestId = requestId;

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
