/**
 * EchoPluginWorker
 * @constructor
 * @implements {cobu.wsc.PluginWorker}
 */
cobu.wsc.EchoPluginWorker = function EchoPluginWorker()
{
   'use strict';

   /** @type {cobu.wsc.PingPongPluginWorker} */
   var self = this;

   /** Constructor */
   function constructor() { }

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
      connection.send(message.data);
   };

   constructor();
};
