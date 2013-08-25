/**
 * StartInstanceRequest
 * @constructor
 */
cobu.wsc.service.StartInstanceRequest = function StartInstanceRequest()
{
   'use strict';

   /**
    * Command for the service API.
    * @type {string}
    */
   this.type = 'request.startInstance';

   /**
    * Name of the instance.
    * @type {string}
    */
   this.instanceName = null;
};