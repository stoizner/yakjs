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
    * @param plugin
    */
   this.addOrUpdatePlugin = function addOrUpdatePlugin(plugin) {
      plugins[plugin.name] = plugin;
   };

   /**
    * @param {cobu.wsc.Plugin} plugin
    */
   this.removePlugin = function removePlugin(plugin) {
      if (plugins.hasOwnProperty(plugin.name)) {
         delete plugins[plugin.name];
      }
   };

   /**
    * @param {string} name
    * @return {null|cobu.wsc.PluginWorker}
    */
   this.createPluginInstance = function createPluginInstance(name) {
      var pluginInstance = null;

      if (plugins.hasOwnProperty(name)) {
         var plugin = plugins[name];

         try {
            pluginInstance = new plugin.PluginWorker();
         } catch(ex) {
            pluginInstance = null;
            console.warn('Plugin instance for plugin ' + name + 'could not be created.');
            console.log(ex);
         }
      }

      return pluginInstance;
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