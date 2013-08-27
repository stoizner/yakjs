/**
 * PluginManager
 * @constructor
 */
cobu.wsc.PluginManager = function PluginManager()
{
   'use strict';

   /** @type {cobu.wsc.PluginManager} */
   var self = this;

   /**
    * @type {Object.<string, cobu.wsc.Plugin>}
    */
   var plugins = {};

   /** Constructor */
   function constructor() {
   }

   /**
    * @param {string} name
    * @returns {cobu.wsc.Plugin}
    */
   this.getPlugin = function getPlugin(name) {
      return plugins[name];
   };

   /**
    * Get list of plugins.
    * @returns {Array.<cobu.wsc.Plugin>}
    */
   this.getPlugins = function getPlugins() {

      var result = [];

      for(var key in plugins) {
         if (plugins.hasOwnProperty(key)) {
            result.push(plugins[key]);
         }
      }

      console.log('getPlugins', result);

      return result;
   };

   /**
    * Check if plugin with given name exists.
    * @param name
    */
   this.hasPlugin = function hasPlugin(name) {
      return plugins.hasOwnProperty(name);
   };

   /**
    * @param plugin
    */
   this.addOrUpdatePlugin = function addOrUpdatePlugin(plugin) {
      plugins[plugin.name] = plugin;
   };

   /**
    * @param {string} name The name of the plugin.
    */
   this.removePlugin = function removePlugin(name) {
      if (plugins.hasOwnProperty(name)) {
         delete plugins[name];
      }
   };

   /**
    * @param {string} name
    * @return {null|cobu.wsc.PluginWorker}
    */
   this.createPluginWorker = function createPluginWorker(name) {
      console.log('CreatePluginWorker: ' + name);
      var pluginWorker = null;

      if (plugins.hasOwnProperty(name)) {
         var plugin = plugins[name];

         try {
            pluginWorker = new plugin.PluginWorker();
            pluginWorker.name = name;
         } catch(ex) {
            pluginWorker = null;
            console.warn('Can not create plugin worker "' + name + '"');
            console.log(ex);
         }
      }

      return pluginWorker;
   };

   /**
    * @param {string} name
    * @param {string} description
    * @param {string} code
    */
   this.createOrUpdatePlugin = function createOrUpdatePlugin(name, description, code) {
      console.log('createOrUpdatePlugin', name, description);
      try {
         var plugin = new cobu.wsc.Plugin();
         plugin.name = name;
         plugin.description = description;
         plugin.code = code;
         plugin.PluginWorker = new Function('return ' + code)();

         plugins[name] = plugin;
      } catch (ex) {
         console.log(ex);
      }
   };

   constructor();
};