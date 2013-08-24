/**
 * PingPongPlugin
 * @constructor
 * @implements {cobu.wsc.WebSocketServerPlugin}
 */
cobu.wsc.PingPongPlugin = function PingPongPlugin()
{
   'use strict';

   /** @type {cobu.wsc.PingPongPlugin} */
   var self = this;

   this.name = 'ping-pong';

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


      if (message.data === 'ping') {
         connection.send('pong');
      }
   };

   constructor();
};
