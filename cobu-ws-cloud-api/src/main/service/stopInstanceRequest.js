/**
 * StopInstanceRequest
 * @class
 * @constructor
 */
cobu.wsc.service.StopInstanceRequest = function StopInstanceRequest()
{
   'use strict';

   /**
    * Command for the service API.
    * @type {string}
    */
   this.type = 'request.stopInstance';

   /**
    * Name of the instance.
    * @type {string}
    */
   this.instanceName = null;
};