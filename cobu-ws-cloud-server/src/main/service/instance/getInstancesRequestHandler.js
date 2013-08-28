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
            instanceInfo.plugins = instance.plugins;
            instanceInfo.description = instance.description;

            response.instances.push(instanceInfo);
         }
         connection.send(response);
      } catch (ex) {
         cloudServer.serviceInstance.log.error(ex.message);
      }
   };

   constructor();
};