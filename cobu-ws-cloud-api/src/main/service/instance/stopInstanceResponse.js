/**
 * StopInstanceResponse
 * @constructor
 */
cobu.wsc.service.StopInstanceResponse = function StopInstanceResponse()
{
   'use strict';

   /**
    * Command for the service API.
    * @type {string}
    */
   this.type = 'response.stopInstance';

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