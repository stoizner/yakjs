/**
 * CreatePluginRequestHandler
 * @constructor
 * @param {cobu.wsc.CloudServer} cloudServer
 * @implements {cobu.wsc.ServiceMessageHandler}
 */
cobu.wsc.CreatePluginRequestHandler = function CreatePluginRequestHandler(cloudServer)
{
   'use strict';

   /** Constructor */
   function constructor() {
   }

   /**
    * @param {cobu.wsc.service.CreatePluginRequest} message
    * @param {cobu.wsc.WebSocketConnection} connection
    */
   this.handle = function handle(message, connection) {

      try {
         if (cloudServer.pluginManager.hasPlugin(message.name)) {
            sendPluginAlreadyExistsResponse(connection);
         } else {
            cloudServer.pluginManager.createOrUpdatePlugin(message.name, message.description, message.code);
            sendSuccessResponse(connection);
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
      var response = new cobu.wsc.service.CreatePluginResponse();
      connection.send(response);
   }

   /**
    * Send an error response
    * @param {cobu.wsc.WebSocketConnection} connection
    */
   function sendPluginAlreadyExistsResponse(connection) {
      var response = new cobu.wsc.service.CreatePluginResponse();
      response.success = false;
      response.message = 'Cannot create plugin: Name is already used.';
      connection.send(response);
   }

   constructor();
};