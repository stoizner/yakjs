/**
 * CreateInstanceRequest
 * @constructor
 */
yak.api.CreateInstanceRequest = function CreateInstanceRequest() {
    'use strict';

    /**
     * Command for the service API.
     * @type {string}
     */
    this.type = 'request.createInstance';

    /**
     * Create unique request id.
     * @type {string}
     */
    this.id = yak.api.guid();

    /**
     * The original instance id.
     * @type {?string}
     */
    this.instanceId = null;

    /**
     * @type {yak.api.Instance}
     */
    this.instance = null;
};
