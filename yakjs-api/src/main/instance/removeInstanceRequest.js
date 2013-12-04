/**
 * RemoveInstanceRequest
 * @constructor
 */
yak.api.RemoveInstanceRequest = function RemoveInstanceRequest() {

    'use strict';

    /**
    * Command for the service API.
    * @type {string}
    */
    this.type = 'request.removeInstance';

    /**
    * Name of the instance.
    * @type {string}
    */
    this.instanceName = null;
};