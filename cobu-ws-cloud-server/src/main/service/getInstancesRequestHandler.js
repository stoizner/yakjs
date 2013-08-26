/**
 * GetInstancesRequestHandler
 * @constructor
 * @param {cobu.wsc.CloudServer} cloudServer
 * @implements {cobu.wsc.ServiceMessageHandler}
 */
cobu.wsc.GetInstancesRequestHandler = function GetInstancesRequestHandler(cloudServer)
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
         var instances = cloudServer.getInstances();
         var response = new cobu.wsc.service.GetInstancesResponse();

         for(var i=0; i<instances.length; i++) {
            var instance = instances[i];

            var instanceInfo = new cobu.wsc.service.InstanceInfo();
            instanceInfo.name = instance.name;
            instanceInfo.connectionCount = instance.getConnections().length;
            instanceInfo.port = instance.port;
            instanceInfo.state = instance.state;
            instanceInfo.plugins = toPluginString(instance.plugins);

            response.instances.push(instanceInfo);
         }
         connection.sendAsJson(response);
      } catch (ex) {
         cloudServer.serviceInstance.log.error(ex.message);
      }
   };

   /**
    *
    * @param {Array.<cobu.wsc.PluginWorker>} plugins
    */
   function toPluginString(plugins) {
      var text = '';

      for(var i=0; i<plugins.length; i++) {
         if (text !== '') {
            text += ", ";
         }
         text += plugins[i].name;
      }

      return text;
   }

   constructor();
};