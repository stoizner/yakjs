/**
 * ViewContext
 * @class
 * @constructor
 */
cobu.wsc.ui.ViewContext = function ViewContext()
{
   'use strict';

   /** @type {cobu.wsc.ui.ViewContext} */
   var self = this;

   /**
    * @type {cobu.wsc.ui.WebSocketAdapter}
    */
   this.webSocket = null;

   /**
    * @type {cobu.EventBus}
    */
   this.eventBus = null;

   /** Constructor */
   function constructor() {
   }

   constructor();
};