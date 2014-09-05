/**
 * StopInstanceRequest
 * @constructor
 */
yak.api.StopInstanceRequest = function StopInstanceRequest() {
    /**
    * Command for the service API.
    * @type {string}
    */
    this.type = 'request.stopInstance';

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
