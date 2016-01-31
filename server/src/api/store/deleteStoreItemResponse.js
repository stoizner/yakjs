/**
 * @constructor
 * @implements {yak.api.Response}
 * @param {string} requestId
 */
yak.api.DeleteStoreItemResponse = function DeleteStoreItemResponse(requestId) {
    /**
     * @type {string}
     */
    this.type = 'yak.api.DeleteStoreItemResponse';

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
};
