/**
 * SetStoreValueRequest
 * @constructor
 */
yak.api.SetStoreValueRequest = function SetStoreValueRequest() {
    'use strict';

    /**
     * Command for the service API.
     * @type {string}
     */
    this.type = 'request.setStoreValue';

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