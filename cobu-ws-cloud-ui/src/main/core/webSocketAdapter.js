/**
 * WebSocketAdapter
 * @class
 * @constructor
 */
cobu.wsc.ui.WebSocketAdapter = function WebSocketAdapter()
{
   'use strict';

   /** @type {cobu.wsc.ui.WebSocketAdapter} */
   var self = this;

   var websocket = null;

   /** Constructor */
   function constructor()
   {
   }

   /**
    * Connect to web socket server.
    * @param wsUri
    */
   this.connect = function connect(wsUri) {

      websocket = new WebSocket(wsUri);
      websocket.onopen = onOpen;
      websocket.onclose = onClose;
      websocket.onmessage = onMessage;
      websocket.onerror = onError;
   };

   /**
    *
    * @param event
    */
   function onOpen(event) {
      console.log("CONNECTED");
   }

   /**
    *
    * @param event
    */
   function onClose(event) {
      console.log("DISCONNECTED");
   }

   /**
    *
    * @param event
    */
   function onMessage(event) {
      console.log('<span style="color: blue;">RESPONSE: ' + evt.data+'</span>');
      // websocket.close();
   }

   /**
    *
    * @param event
    */
   function onError(event) {
      console.log('<span style="color: red;">ERROR:</span> ' + evt.data);
   }

   /**
    *
    * @param message
    */
   function send(message) {
      websocket.send(message);
   }

   constructor();
};