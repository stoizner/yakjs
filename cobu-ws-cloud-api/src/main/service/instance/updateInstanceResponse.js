/**
 * UpdateInstanceResponse
 * @constructor
 */
cobu.wsc.service.UpdateInstanceResponse = function UpdateInstanceResponse()
{
   'use strict';

   /**
    * Command for the service API.
    * @type {string}
    */
   this.type = 'response.updateInstance';

   /**
    * Whether the request was successfully or not.
    * @type {boolean}
    */
   this.success = true;

   /**
    * Optional: Message if no success.
    * @type {string}
    */
   this.message = '';
};