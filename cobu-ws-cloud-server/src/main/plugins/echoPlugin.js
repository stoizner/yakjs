/**
 * EchoPLugin
 * @constructor
 * @implements {cobu.wsc.WebSocketServerPlugin}
 */
cobu.wsc.EchoPLugin = function EchoPLugin()
{
   'use strict';

   /** @type {cobu.wsc.PingPongPlugin} */
   var self = this;

   this.name = self.constructor.name;

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
      connection.send(message.data);
   };

   constructor();
};
