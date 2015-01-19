/**
 * RestartInstanceRequest
 * @constructor
 * @implements {yak.api.Request}
 */
yak.api.RestartInstanceRequest = function RestartInstanceRequest() {
    'use strict';

    /**
     * Command for the service API.
     * @type {string}
     */
    this.type = 'request.restartInstance';

    /**
     * Create unique request id.
     * @type {string}
     */
    this.id = yak.api.guid();

    /**
     * Name of the instance.
     * @type {string}
     */
    this.instanceId = null;
};
