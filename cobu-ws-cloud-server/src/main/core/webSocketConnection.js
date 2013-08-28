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
    * @type {cobu.wsc.Logger}
    */
   var log = new cobu.wsc.Logger(self.constructor.name);

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

      log.info('send', data);
      if (typeof data === 'object') {
         sendAsJson(data);
      } else {
         self.socket.send(data);
      }
   };

   /**
    * Send data on connection.
    * @param {object} obj
    */
   function sendAsJson(obj) {
      self.socket.send(JSON.stringify(obj));
   }

   constructor();
};