/**
 * CreateInstanceResponse
 * @constructor
 */
cobu.wsc.service.CreateInstanceResponse = function CreateInstanceResponse()
{
   'use strict';

   /**
    * Command for the service API.
    * @type {string}
    */
   this.type = 'response.createInstance';

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