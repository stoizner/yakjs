/**
 * StartInstanceRequest
 * @constructor
 */
yak.api.StartInstanceRequest = function StartInstanceRequest() {

    'use strict';

    /**
    * Command for the service API.
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
    this.instanceName = null;
};