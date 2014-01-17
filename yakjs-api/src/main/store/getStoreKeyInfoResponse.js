/**
 * GetStoreKeyInfoResponse
 * @constructor
 */
yak.api.GetStoreKeyInfoResponse = function GetStoreKeyInfoResponse() {
    'use strict';

    /**
     * Command for the service API.
     * @type {string}
     */
    this.type = 'response.getStoreKeyInfo';

    /**
     * List of log information.
     * @type {Array.<yak.api.StoreKeyInfo>}
     */
    this.keys = [];
};