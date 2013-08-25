/**
 * WebSocketServerPlugin
 * @interface
 */
cobu.wsc.WebSocketServerPlugin = function WebSocketServerPlugin(name)
{
   'use strict';

   /** @type {cobu.wsc.WebSocketServerPlugin} */
   var self = this;

   this.name = name;

   /** Constructor */
   function constructor() {
   }

   /**
    * @param {cobu.wsc.WebSocketConnection} connection
    * @param {cobu.wsc.WebSocketServerInstance} instance
    */
   this.onNewConnection = function onNewConnection(connection, instance) {};

   /**
    * @param {cobu.wsc.WebSocketMessage} message
    * @param {cobu.wsc.WebSocketConnection} connection
    * @param {cobu.wsc.WebSocketServerInstance} instance
    */
   this.onMessage = function onMessage(message, connection, instance) {};

   constructor();
};