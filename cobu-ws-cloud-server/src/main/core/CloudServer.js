/**
 * CloudServer
 * @constructor
 */
cobu.wsc.CloudServer = function CloudServer()
{
   'use strict';

   /** @type {cobu.wsc.CloudServer} */
   var self = this;

   /**
    *
    * @type {Object.<string, cobu.wsc.ServerInstance>}
    */
   var instances = {};

   /**
    * @type {cobu.wsc.ServerInstance}
    */
   this.serviceInstance = null;

   /**
    * @type {cobu.wsc.PluginManager}
    */
   this.pluginManager = new cobu.wsc.PluginManager();

   /** Constructor */
   function constructor() {
   }

   /**
    * @param {cobu.wsc.ServerInstance} serviceInstance
    */
   this.start = function start(serviceInstance) {
      if (serviceInstance) {
         self.serviceInstance = serviceInstance;
         self.serviceInstance.start();
      }
   };

   /**
    * Add instance to cloud.
    * @param {cobu.wsc.ServerInstance} instance
    */
   this.addInstance = function addInstance(instance) {
      console.log('addInstance', instance);
      if (instances.hasOwnProperty(instance.name)) {
         throw Error('Instance with name ' + name + ' already added');
      } else {
         instances[instance.name] = instance;
      }
   };

   /**
    * Remove instance
    * @param {string} instanceName
    */
   this.removeInstance = function removeInstance(instanceName) {
      console.log('removeInstance', instanceName);
      if (instances.hasOwnProperty(instanceName)) {
         instances[instanceName].stop();
         delete instances[instanceName];
      }
   };

   /**
    * Get instance by name.
    * @param name
    * @returns {cobu.wsc.ServerInstance}
    */
   this.getInstance = function getInstance(name) {
      return instances[name];
   };

   /**
    *
    * @returns {Array.<cobu.wsc.ServerInstance>}
    */
   this.getInstances = function getInstances() {
      var arr = [];

      for(var key in instances) {
         if (instances.hasOwnProperty(key)) {
            arr.push(instances[key]);
         }
      }

     return arr;
   };

   /**
    * Start/Run an instance.
    * @param {string} name
    */
   this.startInstance = function startInstance(name) {
      if (instances.hasOwnProperty(name)) {
         instances[name].start();
      }  else {
         throw Error('Instance not found ' + name);
      }
   };

   /**
    * Stop an instance.
    * @param {string} name
    */
   this.stopInstance = function stopInstance(name) {
      if (instances.hasOwnProperty(name)) {
         instances[name].stop();
      }  else {
         throw Error('PluginWorker not found ' + name);
      }
   };


   constructor();
};