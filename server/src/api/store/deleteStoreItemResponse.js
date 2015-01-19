/**
 * DeleteStoreItemResponse
 * @constructor
 * @implements {yak.api.Response}
 * @param {string} requestId
 */
yak.api.DeleteStoreItemResponse = function DeleteStoreItemResponse(requestId) {
    /**
     * Command for the service API.
     * @type {string}
     */
    this.type = 'response.deleteStoreItem';

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
