/**
 * GetInstancesResponse
 * @constructor
 */
yak.api.GetInstancesResponse = function GetInstancesResponse() {
    /**
    * Command for the service API.
    * @type {string}
    */
    this.type = 'response.getInstances';

    /**
     * The original request id.
     * @type {null}
     */
    this.requestId = null;

    /**
    * List of available cloud instances as InstanceInfo array.
    * @type {Array.<yak.api.InstanceInfo>}
    */
    this.instances = [];
};
