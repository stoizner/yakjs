/**
 * GetStoreValueRequest
 * @constructor
 */
yak.api.GetStoreValueRequest = function GetStoreValueRequest() {
    'use strict';

    /**
     * Command for the service API.
     * @type {string}
     */
    this.type = 'request.getStoreValue';

    /**
     * Store key
     * @type {?string}
     */
    this.key = null;
};