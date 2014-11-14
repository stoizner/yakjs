/**
 * GetInstancesResponse
 * @constructor
 */
yak.api.GetInstancesResponse = function GetInstancesResponse() {
    'use strict';

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
     * List of available instances as InstanceInfo.
     * @type {Array.<yak.api.InstanceInfo>}
     */
    this.instances = [];
};
