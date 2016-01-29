/**
 * GetStoreValueResponse
 * @constructor
 * @implements {yak.api.Response}
 * @param {string} requestId
 */
yak.api.GetStoreValueResponse = function GetStoreValueResponse(requestId) {
    /**

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
     * The store value.
     * @type {?string}
     */
    this.value = null;

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
