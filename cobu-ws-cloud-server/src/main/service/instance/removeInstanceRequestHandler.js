/**
 * RemoveInstanceRequestHandler
 * @constructor
 * @param {cobu.wsc.CloudServer} cloudServer
 * @implements {cobu.wsc.ServiceMessageHandler}
 */
cobu.wsc.RemoveInstanceRequestHandler = function RemoveInstanceRequestHandler(cloudServer)
{
   'use strict';

   /** @type {cobu.wsc.RemoveInstanceRequestHandler} */
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
         cloudServer.removeInstance(message.instanceName);
         connection.send(new cobu.wsc.service.RemoveInstanceResponse());
      } catch (ex) {
         cloudServer.serviceInstance.log.error(ex.message);
      }
   };

   constructor();
};