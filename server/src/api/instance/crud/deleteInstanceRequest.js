/**
 * DeleteInstanceRequest
 * @constructor
 */
yak.api.DeleteInstanceRequest = function DeleteInstanceRequest() {
    'use strict';

    /**
     * Command for the service API.
     * @type {string}
     */
    this.type = 'request.removeInstance';

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
