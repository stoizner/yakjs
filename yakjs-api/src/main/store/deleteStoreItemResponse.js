/**
 * DeleteStoreItemResponse
 * @constructor
 */
yak.api.DeleteStoreItemResponse = function DeleteStoreItemResponse() {
    'use strict';

    /**
     * Command for the service API.
     * @type {string}
     */
    this.type = 'response.deleteStoreItem';

    /**
     * The original request id.
     * @type {null}
     */
    this.requestId = null;

    /**
     * Was setting store value successful.
     * @type {boolean}
     */
    this.success = true;
};