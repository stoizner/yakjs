/**
 * ServicePlugin
 * @constructor
 * @implements {cobu.wsc.PluginWorker}
 * @param {cobu.wsc.CloudServer} cloudServer
 */
cobu.wsc.ServiceWorker = function ServiceWorker(cloudServer)
{
   'use strict';

   /** @type {cobu.wsc.PingPongPluginWorker} */
   var self = this;

   this.name = self.constructor.name;

   /**
    * @type {cobu.wsc.Logger}
    */
   var log = new cobu.wsc.Logger(self.constructor.name);

   var apiMap = {};

   /** Constructor */
   function constructor() {
      apiMap['request.startInstance'] = new cobu.wsc.StartInstanceRequestHandler(cloudServer);
      apiMap['request.stopInstance'] = new cobu.wsc.StopInstanceRequestHandler(cloudServer);
      apiMap['request.getInstances'] = new cobu.wsc.GetInstancesRequestHandler(cloudServer);
      apiMap['request.createInstance'] = new cobu.wsc.CreateInstanceRequestHandler(cloudServer);
      apiMap['request.updateInstance'] = new cobu.wsc.UpdateInstanceRequestHandler(cloudServer);
      apiMap['request.removeInstance'] = new cobu.wsc.RemoveInstanceRequestHandler(cloudServer);

      apiMap['request.getPlugins'] = new cobu.wsc.GetPluginsRequestHandler(cloudServer);
      apiMap['request.createPlugin'] = new cobu.wsc.CreatePluginRequestHandler(cloudServer);
      apiMap['request.removePlugin'] = new cobu.wsc.RemovePluginRequestHandler(cloudServer);
      apiMap['request.updatePlugin'] = new cobu.wsc.UpdatePluginRequestHandler(cloudServer);
   }

   /**
    * @param {cobu.wsc.WebSocketConnection} connection
    */
   this.onNewConnection = function onNewConnection(connection) {};

   /**
    * @param {cobu.wsc.WebSocketMessage} message
    * @param {cobu.wsc.WebSocketConnection} connection
    * @param {cobu.wsc.WebSocketInstance} instance
    */
   this.onMessage = function onMessage(message, connection, instance) {

      try {
         log.info('onMessage ' + message.data);
         var msg = JSON.parse(message.data);

         if (msg.type) {
            if (apiMap.hasOwnProperty(msg.type)) {
               apiMap[msg.type].handle(msg, connection);
            }
         }
      } catch (ex) {
         console.log(ex);
         console.log(ex.stack);
         log.error(ex.message);
      }
   };

   constructor();
};
