/**
 * GetPluginsRequestHandler
 * @constructor
 * @param {cobu.wsc.CloudServer} cloudServer
 * @implements {cobu.wsc.ServiceMessageHandler}
 */
cobu.wsc.GetPluginsRequestHandler = function GetPluginsRequestHandler(cloudServer)
{
   'use strict';

   /** @type {cobu.wsc.GetPluginsRequestHandler} */
   var self = this;

   /** Constructor */
   function constructor() {
   }

   /**
    * @param {cobu.wsc.WebSocketMessage} message
    * @param {cobu.wsc.WebSocketConnection} connection
    */
   this.handle = function handle(message, connection) {

      try {
         var plugins = cloudServer.pluginManager.getPlugins();

         var response = new cobu.wsc.service.GetPluginsResponse();

         for(var i=0; i < plugins.length; i++) {
            var plugin = plugins[i];

            var pluginInfo = new cobu.wsc.service.PluginInfo();
            pluginInfo.name = plugin.name;
            pluginInfo.description = plugin.description;
            pluginInfo.code = plugin.code;

            response.plugins.push(pluginInfo);
         }
         console.log(response);
         connection.send(response);
      } catch (ex) {
         cloudServer.serviceInstance.log.error(ex.message);
      }
   };

   constructor();
};