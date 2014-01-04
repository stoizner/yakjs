/**
 * RemoveInstanceRequest
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
    * Name of the instance.
    * @type {string}
    */
    this.instanceName = null;
};