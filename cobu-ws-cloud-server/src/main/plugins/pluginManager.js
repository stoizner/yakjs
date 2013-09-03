/**
 * PluginManager
 * @constructor
 * @param {cobu.wsc.Config} config
 */
cobu.wsc.PluginManager = function PluginManager(config)
{
   'use strict';

   /** @type {cobu.wsc.PluginManager} */
   var self = this;

   /**
    * @type {Object.<string, cobu.wsc.Plugin>}
    */
   var plugins = {};

   /**
    * @type {cobu.wsc.Logger}
    */
   var log = new cobu.wsc.Logger(self.constructor.name);

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

      log.info('getPlugins', result);

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
        log.info('CreatePluginWorker: ' + name);
        var pluginWorker = null;

        if (plugins.hasOwnProperty(name)) {
            var plugin = plugins[name];

            try {
                console.log(plugin.PluginWorker);
                pluginWorker = new plugin.PluginWorker();
                pluginWorker.name = name;
            } catch(ex) {
                pluginWorker = null;
                log.warn('Can not create plugin worker "' + name + '"');
                log.info(ex);
                console.log(ex.stack);
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
        log.info('createOrUpdatePlugin', { name: name, description: description, code: code });
        try {
            var plugin = new cobu.wsc.Plugin();
            plugin.name = name;
            plugin.description = description;
            plugin.code = code;
            plugin.PluginWorker = new Function('return ' + code)();

            plugins[name] = plugin;
        } catch (ex) {
            console.log(ex.stack);
            log.warn(ex);
        }
    };

   constructor();
};