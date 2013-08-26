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
    * @type {null|string}
    */
   this.name = null;

   /**
    * Description of the plugin.
    * @type {null|string}
    */
   this.description = null;

   /**
    * @type {null|string}
    */
   this.code = null;

   /**
    * Constructor to create a plugin instance.
    * @constructor
    * @implements {cobu.wsc.PluginWorker}
    */
   this.PluginWorker = function() {};

   /** Constructor */
   function constructor() {
   }

   constructor();
};