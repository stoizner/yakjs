/**
 * RestartInstanceRequest
 * @constructor
 */
yak.api.RestartInstanceRequest = function RestartInstanceRequest() {

    'use strict';

    /**
     * Command for the service API.
     * @type {string}
     */
    this.type = 'request.restartInstance';

    /**
     * Name of the instance.
     * @type {string}
     */
    this.instanceName = null;
};