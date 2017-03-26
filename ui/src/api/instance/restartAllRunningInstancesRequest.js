/**
 * @constructor
 * @implements {yak.api.Request}
 */
yak.api.RestartAllRunningInstancesRequest = function RestartAllRunningInstancesRequest() {
    'use strict';

    /**
     * @type {string}
     */
    this.type = 'request.restartAllRunningInstances';

    /**
     * Create unique request id.
     * @type {string}
     */
    this.id = yak.api.guid();
};
