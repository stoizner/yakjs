/**
 * Plugin
 * @constructor
 */
cobu.wsc.Plugin = function Plugin()
{
   'use strict';

   /** @type {cobu.wsc.Plugin} */
   var self = this;

   /**
    * Name of the plugin (Has to be unique)
    * @type {null}
    */
   this.name = null;

   /**
    * Description of the plugin.
    * @type {null}
    */
   this.description = null;

   /**
    * Constructor to create a plugin instance.
    * @constructor
    * @implements {cobu.wsc.WebSocketServerPlugin}
    */
   this.Instance = function() {};

   /** Constructor */
   function constructor() {
   }

   constructor();
};