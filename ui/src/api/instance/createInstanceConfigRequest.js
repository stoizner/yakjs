/**
 * @constructor
 * @implements {yak.api.Request}
 */
yak.api.CreateInstanceConfigRequest = function CreateInstanceConfigRequest() {
    'use strict';

    /**
     * @type {string}
     */
    this.type = 'request.createInstanceConfig';

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
     * @type {yak.api.InstanceConfig}
     */
    this.instance = null;
};
