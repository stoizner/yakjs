/**
 * GetInstancesResponse
 * @constructor
 * @implements {yak.api.Response}
 * @param {string} requestId
 */
yak.api.GetInstancesResponse = function GetInstancesResponse(requestId) {
    'use strict';

    /**
     * Command for the service API.
     * @type {string}
     */
    this.type = 'response.getInstances';

    /**
     * The original request id.
     * @type {string}
     */
    this.requestId = requestId;

    /**
     * Whether the request was successfully or not.
     * @type {boolean}
     */
    this.success = true;

    /**
     * List of available instances as InstanceInfo.
     * @type {Array.<yak.api.InstanceInfo>}
     */
    this.instances = [];
};
