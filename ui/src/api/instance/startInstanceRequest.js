/**
 * @constructor
 * @implements {yak.api.Request}
 */
yak.api.StartInstanceRequest = function StartInstanceRequest() {
    'use strict';

    /**
     * @type {string}
     */
    this.type = 'request.startInstance';

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
