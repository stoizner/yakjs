/**
 * GetInstancesRequest
 * @constructor
 */
yak.api.GetInstancesRequest = function GetInstancesRequest() {

    'use strict';

    /**
    * Command for the service API.
    * @type {string}
    */
    this.type = 'request.getInstances';

    /**
     * Create unique request id.
     * @type {string}
     */
    this.id = yak.api.guid();
};