/**
 * SetStoreValueResponse
 * @constructor
 * @implements {yak.api.Response}
 * @param {string} requestId
 */
yak.api.SetStoreValueResponse = function SetStoreValueResponse(requestId) {
    /**

     * @type {string}
     */
    this.type = 'response.setStoreValue';

    /**
     * The original request id.
     * @type {string}
     */
    this.requestId = requestId;

    /**
     * Was setting store value successful.
     * @type {boolean}
     */
    this.success = true;

    /**
     * An error message when not successfully.
     * @type {string}
     */
    this.message = '';
};
