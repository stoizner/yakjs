/**
 * WebSocketConnection
 * @class
 * @constructor
 * @param {WebSocket} [socket]
 */
cobu.wsc.WebSocketConnection = function WebSocketConnection(socket)
{
   'use strict';

   /** @type {cobu.wsc.WebSocketConnection} */
   var self = this;

   /**
    * Unique Id of the web socket connection.
    * @type {string}
    */
   this.id = null;

   /**
    * @type {WebSocket|null}
    */
   this.socket = socket || null;

   /** Constructor */
   function constructor() {
      self.id = guid();
   }

   /**
    * Send data on connection.
    * @param {string|object} data
    */
   this.send = function send(data) {

      if (typeof data === 'object') {
         self.sendAsJson(data);
      } else {
         self.socket.send(data);
      }
   };

   /**
    * Send data on connection.
    * @param {object} obj
    */
   this.sendAsJson = function send(obj) {
      self.socket.send(JSON.stringify(obj));
   };

   constructor();
};