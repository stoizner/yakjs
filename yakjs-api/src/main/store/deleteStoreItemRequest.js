/**
 * DeleteStoreItemRequest
 * @constructor
 */
yak.api.DeleteStoreItemRequest = function DeleteStoreItemRequest(key) {
    'use strict';

    /**
     * Command for the service API.
     * @type {string}
     */
    this.type = 'request.deleteStoreItem';

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