/**
 * WebSocketAdapter
 * @class
 * @constructor
 * @param {cobu.EventBus} eventBus
 */
cobu.wsc.ui.WebSocketAdapter = function WebSocketAdapter(eventBus)
{
   'use strict';

   /** @type {cobu.wsc.ui.WebSocketAdapter} */
   var self = this;

   var websocket = null;

   this.onopen = null;
   this.onclose = null;
   this.onerror = null;

   /** Constructor */
   function constructor() {
   }

   /**
    * Connect to web socket server.
    * @param wsUri
    */
   this.connect = function connect(wsUri) {

      try {
         websocket = new WebSocket(wsUri);
         websocket.onopen = handleOpen;
         websocket.onclose = handleClose;
         websocket.onmessage = handleMessage;
         websocket.onerror = handleError;
      } catch(ex) {
         console.log(ex);
         websocket = null;

         if (self.onerror) {
            self.onerror();
         }
      }
   };

   /**
    *
    * @param {string|object} message
    */
   this.send = function send(message) {
      if (typeof message === 'object') {
         websocket.send(JSON.stringify(message));
      } else {
         websocket.send(message);
      }
   };

   /**
    *
    * @param event
    */
   function handleOpen(event) {
      console.log("CONNECTED");

      if (self.onopen) {
         self.onopen();
      }
   }

   /**
    *
    * @param event
    */
   function handleClose(event) {
      console.log("DISCONNECTED");

      if (self.onclose) {
         self.onclose();
      }
   }

   /**
    *
    * @param event
    */
   function handleMessage(event) {

      var msg = null;

      try {
         msg = JSON.parse(event.data);
      } catch(ex) {
         console.log(ex);
      }

      if (msg) {
         eventBus.post(msg);
      }
   }

   /**
    *
    * @param event
    */
   function handleError(event) {

      console.log(event);

      if (self.onerror) {
         self.onerror();
      }
   }



   constructor();
};