/**
 * UpdatePluginRequestHandler
 * @constructor
 * @param {cobu.wsc.CloudServer} cloudServer
 * @implements {cobu.wsc.ServiceMessageHandler}
 */
cobu.wsc.UpdatePluginRequestHandler = function UpdatePluginRequestHandler(cloudServer)
{
   'use strict';

   /** Constructor */
   function constructor() {
   }

   /**
    * @param {cobu.wsc.service.UpdatePluginRequest} message
    * @param {cobu.wsc.WebSocketConnection} connection
    */
   this.handle = function handle(message, connection) {

      try {
         if (cloudServer.pluginManager.hasPlugin(message.pluginName)) {
            cloudServer.pluginManager.removePlugin(message.pluginName);
            cloudServer.pluginManager.createOrUpdatePlugin(message.name, message.description, message.code);
            sendSuccessResponse(connection);
         } else {
            sendPluginNotFoundResponse(message, connection);
         }
      } catch (ex) {
         cloudServer.serviceInstance.log.error(ex.message);
      }
   };

   /**
    * Send success response
    * @param {cobu.wsc.WebSocketConnection} connection
    */
   function sendSuccessResponse(connection) {
      var response = new cobu.wsc.service.UpdatePluginResponse();
      connection.send(response);
   }

   /**
    * Send an error response
    * @param {cobu.wsc.WebSocketConnection} connection
    * @param {cobu.wsc.RemovePluginRequest} message
    */
   function sendPluginNotFoundResponse(message, connection) {
      var response = new cobu.wsc.service.RemovePluginResponse();
      response.success = false;
      response.message = 'Can not find plugin: ' + message.pluginName;
      connection.send(response);
   }

   constructor();
};