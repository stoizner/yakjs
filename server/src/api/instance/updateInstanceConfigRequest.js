/**
 * @constructor
 * @implements {yak.api.Request}
 */
yak.api.UpdateInstanceConfigRequest = function UpdateInstanceConfigRequest() {
    'use strict';

    /**
     * @type {string}
     */
    this.type = 'request.updateInstanceConfig';

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
