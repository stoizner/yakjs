/**
 * GetStoreKeyInfoRequest
 * @constructor
 */
yak.api.GetStoreKeyInfoRequest = function GetStoreKeyInfoRequest() {
    'use strict';

    /**
     * Command for the service API.
     * @type {string}
     */
    this.type = 'request.getStoreKeyInfo';

    /**
     * Create unique request id.
     * @type {string}
     */
    this.id = yak.api.guid();
};