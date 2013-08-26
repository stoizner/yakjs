/**
 * BroadcastPluginWorker
 * @constructor
 * @implements {cobu.wsc.PluginWorker}
 */
cobu.wsc.BroadcastPluginWorker = function BroadcastPluginWorker()
{
   'use strict';

   /** @type {cobu.wsc.BroadcastPluginWorker} */
   var self = this;

   this.name = 'broadcast';

   /** Constructor */
   function constructor()
   {
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

      var connections = instance.getConnections();

      for(var i=0; i<connections.length; i++) {
         var conn = connections[i];

         if (conn.id !== connection.id) {
            conn.send(message.data);
         }
      }
   };

   constructor();
};
