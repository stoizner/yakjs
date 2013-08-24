/**
 * StartInstanceResponse
 * @class
 * @constructor
 */
cobu.wsc.service.StartInstanceResponse = function StartInstanceResponse()
{
   'use strict';

   /**
    * Command for the service API.
    * @type {string}
    */
   this.type = 'response.startInstance';

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