/**
 * RestartInstanceRequest
 * @constructor
 */
yak.api.RestartInstanceRequest = function RestartInstanceRequest() {
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
    this.instanceName = null;
};
