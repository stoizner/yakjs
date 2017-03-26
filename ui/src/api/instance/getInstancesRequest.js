/**
 * @constructor
 * @implements {yak.api.Request}
 */
yak.api.GetInstancesRequest = function GetInstancesRequest() {
    'use strict';

    /**
     * @type {string}
     */
    this.type = 'request.getInstances';

    /**
     * Create unique request id.
     * @type {string}
     */
    this.id = yak.api.guid();
};
