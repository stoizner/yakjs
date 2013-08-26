/**
 * UpdateInstanceRequest
 * @constructor
 */
cobu.wsc.service.UpdateInstanceRequest = function UpdateInstanceRequest()
{
   'use strict';

   /**
    * Command for the service API.
    * @type {string}
    */
   this.type = 'request.updateInstance';

   /**
    * The original instance name.
    * @type {null}
    */
   this.instanceName = null;

   /**
    * Unique name of instance.
    * @type {string}
    */
   this.name = null;

   /**
    * Some description.
    * @type {string}
    */
   this.description = null;

   /**
    *
    * @type {number}
    */
   this.port = 0;

   /**
    * Name of plugins that shall be used by this instance.
    * @type {Array.<string>}
    */
   this.plugins = [];
};