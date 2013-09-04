/**
 * DeleteInstanceRequest
 * @constructor
 */
cobu.wsc.service.DeleteInstanceRequest = function DeleteInstanceRequest() {

    'use strict';

    /**
    * Command for the service API.
    * @type {string}
    */
    this.type = 'request.deleteInstance';

    /**
    * Name of the instance.
    * @type {string}
    */
    this.instanceName = null;
};