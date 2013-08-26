/**
 * StartInstanceRequestHandler
 * @constructor
 * @param {cobu.wsc.CloudServer} cloudServer
 * @implements {cobu.wsc.ServiceMessageHandler}
 */
cobu.wsc.StartInstanceRequestHandler = function StartInstanceRequestHandler(cloudServer)
{
   'use strict';

   /** @type {cobu.wsc.StartInstanceRequestHandler} */
   var self = this;

   /** Constructor */
   function constructor()
   {
   }

   /**
    * @param {cobu.wsc.WebSocketMessage} message
    * @param {cobu.wsc.WebSocketConnection} connection
    */
   this.handle = function handle(message, connection) {

      try {
         cloudServer.startInstance(message.instanceName);
         connection.sendAsJson(new cobu.wsc.service.StartInstanceResponse());
      } catch (ex) {
         cloudServer.serviceInstance.log.error(ex.message);
      }
   };

   constructor();
};