/**
 * GetStoreValueResponse
 * @constructor
 */
yak.api.GetStoreValueResponse = function GetStoreValueResponse() {
    'use strict';

    /**
     * Command for the service API.
     * @type {string}
     */
    this.type = 'response.getStoreValue';

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