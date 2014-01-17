/**
 * SetStoreValueResponse
 * @constructor
 */
yak.api.SetStoreValueResponse = function SetStoreValueResponse() {
    'use strict';

    /**
     * Command for the service API.
     * @type {string}
     */
    this.type = 'response.setStoreValue';

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