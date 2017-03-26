/**
 * @constructor
 * @implements {yak.api.Request}
 */
yak.api.DeleteInstanceConfigRequest = function DeleteInstanceConfigRequest() {
    'use strict';

    /**
     * @type {string}
     */
    this.type = 'request.deleteInstanceConfig';

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
