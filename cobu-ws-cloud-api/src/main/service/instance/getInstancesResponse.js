/**
 * GetInstancesResponse
 * @constructor
 */
cobu.wsc.service.GetInstancesResponse = function GetInstancesResponse()
{
   'use strict';

   /**
    * Command for the service API.
    * @type {string}
    */
   this.type = 'response.getInstances';

   /**
    * List of available cloud instances as InstanceInfo array.
    * @type {Array.<cobu.wsc.service.InstanceInfo>}
    */
   this.instances = [];
};