/**
 * ServicePlugin
 * @constructor
 * @implements {cobu.wsc.WebSocketServerPlugin}
 * @param {cobu.wsc.CloudServer} cloudServer
 */
cobu.wsc.ServicePlugin = function ServicePlugin(cloudServer)
{
   'use strict';

   /** @type {cobu.wsc.PingPongPlugin} */
   var self = this;

   this.name = self.constructor.name;

   var apiMap = {};

   /** Constructor */
   function constructor() {
      apiMap['request.startInstance'] = new cobu.wsc.StartInstanceRequestHandler(cloudServer);
      apiMap['request.stopInstance'] = new cobu.wsc.StopInstanceRequestHandler(cloudServer);
      apiMap['request.getInstances'] = new cobu.wsc.GetInstancesRequestHandler(cloudServer);
      apiMap['request.createInstance'] = new cobu.wsc.CreateInstanceRequestHandler(cloudServer);
   }

   /**
    * @param {cobu.wsc.WebSocketConnection} connection
    */
   this.onNewConnection = function onNewConnection(connection) {};

   /**
    * @param {cobu.wsc.WebSocketMessage} message
    * @param {cobu.wsc.WebSocketConnection} connection
    * @param {cobu.wsc.WebSocketServerInstance} instance
    */
   this.onMessage = function onMessage(message, connection, instance) {

      try {
         instance.log.info('onMessage ' + message.data);
         var msg = JSON.parse(message.data);

         if (msg.type) {
            if (apiMap.hasOwnProperty(msg.type)) {
               apiMap[msg.type].handle(msg, connection);
            }
         }
      } catch (ex) {
         instance.log.error(ex.message);
      }
   };

   constructor();
};
