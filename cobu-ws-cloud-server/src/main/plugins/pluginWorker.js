/**
 * PluginWorker
 * @interface
 */
cobu.wsc.PluginWorker = function PluginWorker(name)
{
   'use strict';

   /** @type {cobu.wsc.PluginWorker} */
   var self = this;

   this.name = name;

   /** Constructor */
   function constructor() {
   }

   /**
    * @param {cobu.wsc.WebSocketConnection} connection
    * @param {cobu.wsc.WebSocketInstance} instance
    */
   this.onNewConnection = function onNewConnection(connection, instance) {};

   /**
    * @param {cobu.wsc.WebSocketMessage} message
    * @param {cobu.wsc.WebSocketConnection} connection
    * @param {cobu.wsc.WebSocketInstance} instance
    */
   this.onMessage = function onMessage(message, connection, instance) {};

   constructor();
};