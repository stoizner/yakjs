/**
 * Codebullets
 * @namespace cobu
 */
var cobu = cobu || {};

/**
 * Web Socket Cloud
 * @namespace cobu
 */
cobu.wsc = cobu.wsc || {};


/**
 * Codebullets.
 * @namespace cobu
 */
var cobu = cobu || {};

/**
 * Web Socket Cloud
 * @namespace cobu
 */
cobu.wsc = cobu.wsc || {};

/**
 * Web Socket Cloud - Service API
 * @namespace cobu
 */
cobu.wsc.service = cobu.wsc.service || {};


/**
 * CreateInstanceRequest
 * @constructor
 */
cobu.wsc.service.CreateInstanceRequest = function CreateInstanceRequest()
{
   'use strict';

   /**
    * Command for the service API.
    * @type {string}
    */
   this.type = 'request.createInstance';

   /**
    * Unique name of instance.
    * @type {string}
    */
   this.name = null;

   /**
    * Some description.
    * @type {string}
    */
   this.description = null;

   /**
    *
    * @type {number}
    */
   this.port = 0;

   /**
    * Name of plugins that shall be used by this instance.
    * @type {Array.<string>}
    */
   this.plugins = [];
};/**
 * CreateInstanceResponse
 * @constructor
 */
cobu.wsc.service.CreateInstanceResponse = function CreateInstanceResponse()
{
   'use strict';

   /**
    * Command for the service API.
    * @type {string}
    */
   this.type = 'response.createInstance';

   /**
    * Whether the request was successfully or not.
    * @type {boolean}
    */
   this.success = true;

   /**
    * Optional: Message if no success.
    * @type {string}
    */
   this.message = '';
};/**
 * DeleteInstanceRequest
 * @constructor
 */
cobu.wsc.service.DeleteInstanceRequest = function DeleteInstanceRequest()
{
   'use strict';

   /**
    * Command for the service API.
    * @type {string}
    */
   this.type = 'request.deleteInstance';

   /**
    * Name of the instance.
    * @type {string}
    */
   this.instanceName = null;
};/**
 * DeleteInstanceResponse
 * @constructor
 */
cobu.wsc.service.DeleteInstanceResponse = function DeleteInstanceResponse()
{
   'use strict';

   /**
    * Command for the service API.
    * @type {string}
    */
   this.type = 'response.deleteInstance';

   /**
    * Whether the request was successfully or not.
    * @type {boolean}
    */
   this.success = true;

   /**
    * Optional: Message if no success.
    * @type {string}
    */
   this.message = '';
};/**
 * GetInstancesRequest
 * @constructor
 */
cobu.wsc.service.GetInstancesRequest = function GetInstancesRequest()
{
   'use strict';

   /**
    * Command for the service API.
    * @type {string}
    */
   this.type = 'request.getInstances';
};/**
 * GetInstancesResponse
 * @constructor
 */
cobu.wsc.service.GetInstancesResponse = function GetInstancesResponse()
{
   'use strict';

   /**
    * Command for the service API.
    * @type {string}
    */
   this.type = 'response.getInstances';

   /**
    * List of available cloud instances as InstanceInfo array.
    * @type {Array.<cobu.wsc.service.InstanceInfo>}
    */
   this.instances = [];
};/**
 * InstanceInfo
 * @constructor
 */
cobu.wsc.service.InstanceInfo = function InstanceInfo()
{
   'use strict';

   /**
    *
    * @type {string}
    */
   this.name = null;

   /**
    *
    * @type {string}
    */
   this.state = null;

   /**
    * Description
    * @type {null|string}
    */
   this.description = null;

   /**
    *
    * @type {number}
    */
   this.connectionCount = 0;

   /**
    *
    * @type {number}
    */
   this.port = null;

   /**
    *
    * @type {Array.<string>}
    */
   this.plugins = [];
};/**
 * RemoveInstanceRequest
 * @constructor
 */
cobu.wsc.service.RemoveInstanceRequest = function RemoveInstanceRequest()
{
   'use strict';

   /**
    * Command for the service API.
    * @type {string}
    */
   this.type = 'request.removeInstance';

   /**
    * Name of the instance.
    * @type {string}
    */
   this.instanceName = null;
};/**
 * RemoveInstanceResponse
 * @constructor
 */
cobu.wsc.service.RemoveInstanceResponse = function RemoveInstanceResponse()
{
   'use strict';

   /**
    * Command for the service API.
    * @type {string}
    */
   this.type = 'response.removeInstance';

   /**
    * Whether the request was successfully or not.
    * @type {boolean}
    */
   this.success = true;

   /**
    * Optional: Message if no success.
    * @type {string}
    */
   this.message = '';
};/**
 * StartInstanceRequest
 * @constructor
 */
cobu.wsc.service.StartInstanceRequest = function StartInstanceRequest()
{
   'use strict';

   /**
    * Command for the service API.
    * @type {string}
    */
   this.type = 'request.startInstance';

   /**
    * Name of the instance.
    * @type {string}
    */
   this.instanceName = null;
};/**
 * StartInstanceResponse
 * @constructor
 */
cobu.wsc.service.StartInstanceResponse = function StartInstanceResponse()
{
   'use strict';

   /**
    * Command for the service API.
    * @type {string}
    */
   this.type = 'response.startInstance';

   /**
    * Whether the request was successfully or not.
    * @type {boolean}
    */
   this.success = true;

   /**
    * Optional: Message if no success.
    * @type {string}
    */
   this.message = '';
};/**
 * StopInstanceRequest
 * @constructor
 */
cobu.wsc.service.StopInstanceRequest = function StopInstanceRequest()
{
   'use strict';

   /**
    * Command for the service API.
    * @type {string}
    */
   this.type = 'request.stopInstance';

   /**
    * Name of the instance.
    * @type {string}
    */
   this.instanceName = null;
};/**
 * StopInstanceResponse
 * @constructor
 */
cobu.wsc.service.StopInstanceResponse = function StopInstanceResponse()
{
   'use strict';

   /**
    * Command for the service API.
    * @type {string}
    */
   this.type = 'response.stopInstance';

   /**
    * Whether the request was successfully or not.
    * @type {boolean}
    */
   this.success = true;

   /**
    * Optional: Message if no success.
    * @type {string}
    */
   this.message = '';
};/**
 * UpdateInstanceRequest
 * @constructor
 */
cobu.wsc.service.UpdateInstanceRequest = function UpdateInstanceRequest()
{
   'use strict';

   /**
    * Command for the service API.
    * @type {string}
    */
   this.type = 'request.updateInstance';

   /**
    * The original instance name.
    * @type {null}
    */
   this.instanceName = null;

   /**
    * Unique name of instance.
    * @type {string}
    */
   this.name = null;

   /**
    * Some description.
    * @type {string}
    */
   this.description = null;

   /**
    *
    * @type {number}
    */
   this.port = 0;

   /**
    * Name of plugins that shall be used by this instance.
    * @type {Array.<string>}
    */
   this.plugins = [];
};/**
 * UpdateInstanceResponse
 * @constructor
 */
cobu.wsc.service.UpdateInstanceResponse = function UpdateInstanceResponse()
{
   'use strict';

   /**
    * Command for the service API.
    * @type {string}
    */
   this.type = 'response.updateInstance';

   /**
    * Whether the request was successfully or not.
    * @type {boolean}
    */
   this.success = true;

   /**
    * Optional: Message if no success.
    * @type {string}
    */
   this.message = '';
};/**
 * CreatePluginRequest
 * @constructor
 */
cobu.wsc.service.CreatePluginRequest = function CreatePluginRequest()
{
   'use strict';

   /**
    * Command for the service API.
    * @type {string}
    */
   this.type = 'request.createPlugin';

   /**
    * Unique name of Plugin.
    * @type {string}
    */
   this.name = null;

   /**
    * Some description.
    * @type {string}
    */
   this.description = null;

   /**
    * Plugin Code.
    * @type {string}
    */
   this.code = null;
};/**
 * CreatePluginResponse
 * @constructor
 */
cobu.wsc.service.CreatePluginResponse = function CreatePluginResponse()
{
   'use strict';

   /**
    * Command for the service API.
    * @type {string}
    */
   this.type = 'response.createPlugin';

   /**
    * Whether the request was successfully or not.
    * @type {boolean}
    */
   this.success = true;

   /**
    * Optional: Message if no success.
    * @type {string}
    */
   this.message = '';
};/**
 * GetPluginsRequest
 * @constructor
 */
cobu.wsc.service.GetPluginsRequest = function GetPluginsRequest()
{
   'use strict';

   /**
    * Command for the service API.
    * @type {string}
    */
   this.type = 'request.getPlugins';
};/**
 * GetPluginsResponse
 * @constructor
 */
cobu.wsc.service.GetPluginsResponse = function GetPluginsResponse()
{
   'use strict';

   /**
    * Command for the service API.
    * @type {string}
    */
   this.type = 'response.getPlugins';

   /**
    * List of available cloud Plugins as InstanceInfo array.
    * @type {Array.<cobu.wsc.service.PluginInfo>}
    */
   this.plugins = [];
};/**
 * PluginInfo
 * @constructor
 */
cobu.wsc.service.PluginInfo = function PluginInfo()
{
   'use strict';

   /**
    *
    * @type {string}
    */
   this.name = null;

   /**
    *
    * @type {string}
    */
   this.description = null;

   /**
    *
    * @type {string}
    */
   this.code = null;
};/**
 * RemovePluginRequest
 * @constructor
 */
cobu.wsc.service.RemovePluginRequest = function RemovePluginRequest()
{
   'use strict';

   /**
    * Command for the service API.
    * @type {string}
    */
   this.type = 'request.removePlugin';

   /**
    * Name of the Plugin.
    * @type {string}
    */
   this.pluginName = null;
};/**
 * RemovePluginResponse
 * @constructor
 */
cobu.wsc.service.RemovePluginResponse = function RemovePluginResponse()
{
   'use strict';

   /**
    * Command for the service API.
    * @type {string}
    */
   this.type = 'response.deletePlugin';

   /**
    * Whether the request was successfully or not.
    * @type {boolean}
    */
   this.success = true;

   /**
    * Optional: Message if no success.
    * @type {string}
    */
   this.message = '';
};/**
 * UpdatePluginRequest
 * @constructor
 */
cobu.wsc.service.UpdatePluginRequest = function UpdatePluginRequest()
{
   'use strict';

   /**
    * Command for the service API.
    * @type {string}
    */
   this.type = 'request.updatePlugin';

   /**
    * The original Plugin name.
    * @type {null}
    */
   this.pluginName = null;

   /**
    * Unique name of Plugin.
    * @type {string}
    */
   this.name = null;

   /**
    * Some description.
    * @type {string}
    */
   this.description = null;

   /**
    * The plugin code.
    * @type {string}
    */
   this.code = 0;
};/**
 * UpdatePluginResponse
 * @constructor
 */
cobu.wsc.service.UpdatePluginResponse = function UpdatePluginResponse()
{
   'use strict';

   /**
    * Command for the service API.
    * @type {string}
    */
   this.type = 'response.updatePlugin';

   /**
    * Whether the request was successfully or not.
    * @type {boolean}
    */
   this.success = true;

   /**
    * Optional: Message if no success.
    * @type {string}
    */
   this.message = '';
};/**
 * CloudServer
 * @constructor
 */
cobu.wsc.CloudServer = function CloudServer() {

   'use strict';

   /** @type {cobu.wsc.CloudServer} */
   var self = this;

   /**
    *
    * @type {Object.<string, cobu.wsc.ServerInstance>}
    */
   var instances = {};

   /**
    * @type {cobu.wsc.Logger}
    */
   var log = new cobu.wsc.Logger(self.constructor.name);

   /**
    * @type {cobu.wsc.WebSocketInstance}
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
      log.info('addInstance', instance);
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
      log.info('removeInstance', instanceName);
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
    * @returns {Array.<cobu.wsc.WebSocketInstance>}
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
};/**
 * InstanceState
 * @enum {string}
 */
cobu.wsc.InstanceState = {
   STARTING: 'starting',
   STOPPED: 'stopped',
   RUNNING: 'running',
   STOPPING: 'stopping',
   ERROR: 'error'
};
/**
 * Logger
 * @class
 * @constructor
 * @param {string} [name]
 */
cobu.wsc.Logger = function Logger(name)
{
   'use strict';

   /** @type {cobu.wsc.Logger} */
   var self = this;

   var category = name || '';

   /** Constructor */
   function constructor() {
   }

   /**
    * @param {string|object} message
    * @param {string|object} [data]
    */
   this.info = function info(message, data) {
      var logInfo = toLogInfo(message, data);
      var msg = 'INFO : ' + '[' + category + '] ' +  logInfo.message;
      log(msg.trim(), logInfo.data);
   };

   /**
    * @param {string|object} message
    * @param {string|object} [data]
    */
   this.warn = function warn(message, data) {
      var logInfo = toLogInfo(message, data);
      var msg = 'WARN : ' + '[' + category + '] ' + logInfo.message;
      log(msg.trim(), logInfo.data);
   };

   /**
    * @param {string|object} message
    * @param {string|object} [data]
    */
   this.error = function error(message, data) {
      var logInfo = toLogInfo(message);
      var msg = 'ERROR: ' + '[' + category + '] ' + logInfo.message;
      log(msg.trim(), logInfo.data);
   };

   /**
    *
    * @param {string} message
    * @param {null|object} data
    */
   function log(message, data) {
      if (data !== null) {
         console.log(message, data);
      } else {
         console.log(message);
      }
   }

   /**
    * @param {string|object} message
    * @return {{message: string, data: null|string|object}}
    * @param {string|object} [data]
    */
   function toLogInfo(message, data) {

      var info = { message: '', data: null };

      if (typeof message === 'string') {
         info.message = message;
      } else if (typeof message === 'object') {
         if (message.message) {
            info.message = message.message;
            info.data = message;
         } else {
            info.message = message.toString();
            info.data = message;
         }
      }

      if (typeof data !== 'undefined') {
         info.data = data;
      }

      return info;
   }

   constructor();
};/**
 * ServerInstance
 * @interface
 */
cobu.wsc.ServerInstance = function ServerInstance()
{
   'use strict';

   /**
    * The unique instance name.
    * @type {null}
    */
   this.name = null;

   /**
    * Start instance.
    */
   this.start = function start() {};

   /**
    * Stop instance.
    */
   this.stop = function stop() {};

   /**
    * Description
    * @type {string}
    */
   this.description = '';

   /**
    * @type {cobu.wsc.Logger}
    */
   this.log = new cobu.wsc.Logger(self.name);
};/**
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
};/**
 * WebSocketInstance
 * @constructor
 * @implements {cobu.wsc.ServerInstance}
 * @param {number} [port]
 * @param {string} name Unique instance name.
 * @param {cobu.wsc.CloudServer} cloudServer
 */
cobu.wsc.WebSocketInstance = function WebSocketInstance(name, port, cloudServer) {

    'use strict';

    var WebSocketServer = require('ws').Server;

    var server = null;

    /** @type {cobu.wsc.WebSocketInstance} */
    var self = this;

    /**
    *
    * @type {Object.<string, cobu.wsc.WebSocketConnection>}
    */
    var connections = {};

    /**
    * Server port
    * @type {number} default: 8080;
    */
    this.port = port || 8080;

    /**
    * Description
    * @type {string}
    */
    this.description = '';

    /**
    * Unique instance name.
    * @type {string}
    */
    this.name = name;

    /**
    * @type {Array.<string>}
    */
    this.plugins = [];

    /**
    * @type {cobu.wsc.Logger}
    */
    var log = new cobu.wsc.Logger(name);

    /**
    * Expose logger.
    * @type {cobu.wsc.Logger}
    */
    this.log = log;

    /**
    * @type {cobu.wsc.InstanceState}
    */
    this.state = cobu.wsc.InstanceState.STOPPED;

    /**
    * @type {Array.<cobu.wsc.PluginWorker>}
    */
    var pluginWorkers = [];

    /** Constructor */
    function constructor() {
    }

    /**
    * Start server instance
    */
    this.start = function start() {

        log.info('Start WebSocketServer Instance.');
        try {
            if (self.state !== cobu.wsc.InstanceState.RUNNING) {
                initializePlugins();
                startServer();
                self.state = cobu.wsc.InstanceState.RUNNING;
            } else {
                log.info('Can not start, Instance already running.');
            }
        } catch (ex) {
            log.error('Could not start instance: ' + ex.message);
            self.state = cobu.wsc.InstanceState.ERROR;
        }
    };

    /**
     * Stop server instance.
     */
    this.stop = function stop() {

        try {
            if (server && self.state === cobu.wsc.InstanceState.RUNNING) {
                self.state = cobu.wsc.InstanceState.STOPPING;
                log.info('Stopping WebSocketInstance...');
                server.close();
                server = null;
                self.state = cobu.wsc.InstanceState.STOPPED;
            }
        } catch (ex) {
            log.error('Could not stop instance: ' + ex.message);
            self.state = cobu.wsc.InstanceState.ERROR;
        }
    };

    /**
     * Start the web socket.
     */
    function startServer() {
        log.info('Start web socket.');
        server = new WebSocketServer({port: self.port});
        server.on('connection', handleConnection);
    }

    /**
     * Initialize plugins.
     */
    function initializePlugins() {

        log.info('Initialize ' + self.plugins.length + ' plugins.');
        pluginWorkers = [];

        for(var i=0; i<self.plugins.length; i++) {

            var pluginName = self.plugins[i].trim();
            var worker = cloudServer.pluginManager.createPluginWorker(pluginName);

            // Extend with pluginName
            worker.name = pluginName;

            if (worker !== null) {
                pluginWorkers.push(worker);
                log.info(pluginName + ' initialized.')
            } else {
                log.warn(pluginName + ' not initialized.')
            }
        }
    }

    /**
    * Get all connections.
    * @return {Array.<cobu.wsc.WebSocketConnection>}
    */
    this.getConnections = function getConnections() {

        var connectionList = [];

        for(var key in connections) {
            if (connections.hasOwnProperty(key)) {
                connectionList.push(connections[key]);
            }
        }

        return connectionList;
    };

    /**
     * Creates a handler function to handle connection events.
     */
    function handleConnection(socket) {

        var connection = new cobu.wsc.WebSocketConnection();
        connection.socket = socket;

        log.info('connected ' + connection.id);

        connections[connection.id] = connection;

        socket.on('close', function() {
            self.log.info('onclose ' + connection.id);
            connections[connection.id] = null;
        });

        socket.on('message', createMessageHandler(connection));
    }


    /**
     * @param {cobu.wsc.WebSocketConnection} connection
     * @returns {Function}
     */
    function createMessageHandler(connection) {

        return function handleMessage(data, flags) {

            log.info('message ' + connection.id + ', ' + data);

            for(var i=0; i<pluginWorkers.length; i++) {
                pluginWorkerOnMessage(pluginWorkers[i], data, connection);
            }
        }
    }

    /**
     *
     * @param {cobu.wsc.PluginWorker} pluginWorker
     * @param {string} data
     * @param {cobu.wsc.WebSocketConnection} connection
     */
    function pluginWorkerOnMessage(pluginWorker, data, connection) {

        if (pluginWorker.onMessage) {
            try {
                self.log.info(pluginWorker.name + '.onMessage(...)');
                pluginWorker.onMessage(new cobu.wsc.WebSocketMessage(data), connection, self);
            } catch (ex) {
                self.log.warn('PluginWorker ' + pluginWorker.name + 'onMessage(...) failed.', ex);
            }
        } else {
            self.log.warn('PluginWorker ' + pluginWorker.name + ' has no method onMessage.');
        }
    }

    constructor();
};/**
 * WebSocketMessage
 * @class
 * @constructor
 * @param {string} data
 */
cobu.wsc.WebSocketMessage = function WebSocketMessage(data)
{
   'use strict';

   /**
    * @type {string|null}
    */
   this.data = data || null;

   /** Constructor */
   function constructor() {
   }

   constructor();
};function s4() {
   return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
}

/**
 * http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
 * @returns {string}
 */
function guid() {
   return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
}
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
};/**
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
};/**
 * PluginWorker
 * @interface
 */
cobu.wsc.PluginWorker = function PluginWorker(name)
{
   'use strict';

   /** @type {cobu.wsc.PluginWorker} */
   var self = this;

   this.name = name;

   /** Constructor */
   function constructor() {
   }

   /**
    * @param {cobu.wsc.WebSocketConnection} connection
    * @param {cobu.wsc.WebSocketInstance} instance
    */
   this.onNewConnection = function onNewConnection(connection, instance) {};

   /**
    * @param {cobu.wsc.WebSocketMessage} message
    * @param {cobu.wsc.WebSocketConnection} connection
    * @param {cobu.wsc.WebSocketInstance} instance
    */
   this.onMessage = function onMessage(message, connection, instance) {};

   constructor();
};/**
 * BroadcastPluginWorker
 * @constructor
 * @implements {cobu.wsc.PluginWorker}
 */
cobu.wsc.BroadcastPluginWorker = function BroadcastPluginWorker()
{
   'use strict';

   /** @type {cobu.wsc.BroadcastPluginWorker} */
   var self = this;

   this.name = 'broadcast';

   /** Constructor */
   function constructor()
   {
   }

   /**
    * @param {cobu.wsc.WebSocketConnection} connection
    */
   this.onNewConnection = function onNewConnection(connection) {};

   /**
    * @param {cobu.wsc.WebSocketMessage} message
    * @param {cobu.wsc.WebSocketConnection} connection
    * @param {cobu.wsc.WebSocketInstance} instance
    */
   this.onMessage = function onMessage(message, connection, instance) {

      var connections = instance.getConnections();

      for(var i=0; i<connections.length; i++) {
         var conn = connections[i];

         if (conn.id !== connection.id) {
            conn.send(message.data);
         }
      }
   };

   constructor();
};
/**
 * EchoPluginWorker
 * @constructor
 * @implements {cobu.wsc.PluginWorker}
 */
cobu.wsc.EchoPluginWorker = function EchoPluginWorker()
{
   'use strict';

   /** @type {cobu.wsc.PingPongPluginWorker} */
   var self = this;

   /** Constructor */
   function constructor() { }

   /**
    * @param {cobu.wsc.WebSocketConnection} connection
    */
   this.onNewConnection = function onNewConnection(connection) {};

   /**
    * @param {cobu.wsc.WebSocketMessage} message
    * @param {cobu.wsc.WebSocketConnection} connection
    * @param {cobu.wsc.WebSocketInstance} instance
    */
   this.onMessage = function onMessage(message, connection, instance) {
      connection.send(message.data);
   };

   constructor();
};
/**
 * PingPongPluginWorker
 * @constructor
 * @implements {cobu.wsc.PluginWorker}
 */
cobu.wsc.PingPongPluginWorker = function PingPongPluginWorker()
{
   'use strict';

   /** @type {cobu.wsc.PingPongPluginWorker} */
   var self = this;

   /** Constructor */
   function constructor() {
   }

   /**
    * @param {cobu.wsc.WebSocketConnection} connection
    */
   this.onNewConnection = function onNewConnection(connection) {};

   /**
    * @param {cobu.wsc.WebSocketMessage} message
    * @param {cobu.wsc.WebSocketConnection} connection
    * @param {cobu.wsc.WebSocketInstance} instance
    */
   this.onMessage = function onMessage(message, connection, instance) {
      if (message.data === 'ping') {
         connection.send('pong');
      }
   };

   constructor();
};
/**
 * CreateInstanceRequestHandler
 * @constructor
 * @param {cobu.wsc.CloudServer} cloudServer
 * @implements {cobu.wsc.ServiceMessageHandler}
 */
cobu.wsc.CreateInstanceRequestHandler = function CreateInstanceRequestHandler(cloudServer)
{
   'use strict';

   /** @type {cobu.wsc.CreateInstanceRequestHandler} */
   var self = this;

   /** Constructor */
   function constructor()
   {
   }

   /**
    * @param {cobu.wsc.service.CreateInstanceRequest} message
    * @param {cobu.wsc.WebSocketConnection} connection
    */
   this.handle = function handle(message, connection) {

      try {

         var isNameAlreadyUsed = checkInstanceName(message.name);

         if (isNameAlreadyUsed) {
            var response = new cobu.wsc.service.CreateInstanceResponse();
            response.success = false;
            response.message = 'Cannot create instance: Name is already used.';
            connection.send(response);
         } else {
            var newInstance = new cobu.wsc.WebSocketInstance(message.name, message.port, cloudServer);
            newInstance.description = message.description;

            cloudServer.addInstance(newInstance);
            connection.send(new cobu.wsc.service.CreateInstanceResponse());
         }
      } catch (ex) {
         cloudServer.serviceInstance.log.error(ex.message);
      }
   };

   /**
    * Check if instance name is already in use.
    * @param {string} name
    */
   function checkInstanceName(name) {

      var isNameAlreadyUsed = false;
      var instances = cloudServer.getInstances();

      for(var i=0; i<instances.length; i++) {
         if (instances[i].name.trim() === name.trim()) {
            isNameAlreadyUsed = true;
            break;
         }
      }

      return isNameAlreadyUsed;
   }

   constructor();
};/**
 * GetInstancesRequestHandler
 * @constructor
 * @param {cobu.wsc.CloudServer} cloudServer
 * @implements {cobu.wsc.ServiceMessageHandler}
 */
cobu.wsc.GetInstancesRequestHandler = function GetInstancesRequestHandler(cloudServer)
{
   'use strict';

   /** @type {cobu.wsc.StartInstanceRequestHandler} */
   var self = this;

   /** Constructor */
   function constructor()
   {
   }

   /**
    * @param {cobu.wsc.WebSocketMessage} message
    * @param {cobu.wsc.WebSocketConnection} connection
    */
   this.handle = function handle(message, connection) {

      try {
         var instances = cloudServer.getInstances();
         var response = new cobu.wsc.service.GetInstancesResponse();

         for(var i=0; i<instances.length; i++) {
            var instance = instances[i];

            var instanceInfo = new cobu.wsc.service.InstanceInfo();
            instanceInfo.name = instance.name;
            instanceInfo.connectionCount = instance.getConnections().length;
            instanceInfo.port = instance.port;
            instanceInfo.state = instance.state;
            instanceInfo.plugins = instance.plugins;
            instanceInfo.description = instance.description;

            response.instances.push(instanceInfo);
         }
         connection.send(response);
      } catch (ex) {
         cloudServer.serviceInstance.log.error(ex.message);
      }
   };

   constructor();
};/**
 * RemoveInstanceRequestHandler
 * @constructor
 * @param {cobu.wsc.CloudServer} cloudServer
 * @implements {cobu.wsc.ServiceMessageHandler}
 */
cobu.wsc.RemoveInstanceRequestHandler = function RemoveInstanceRequestHandler(cloudServer)
{
   'use strict';

   /** @type {cobu.wsc.RemoveInstanceRequestHandler} */
   var self = this;

   /** Constructor */
   function constructor()
   {
   }

   /**
    * @param {cobu.wsc.WebSocketMessage} message
    * @param {cobu.wsc.WebSocketConnection} connection
    */
   this.handle = function handle(message, connection) {

      try {
         cloudServer.removeInstance(message.instanceName);
         connection.sendAsJson(new cobu.wsc.service.RemoveInstanceResponse());
      } catch (ex) {
         cloudServer.serviceInstance.log.error(ex.message);
      }
   };

   constructor();
};/**
 * StartInstanceRequestHandler
 * @constructor
 * @param {cobu.wsc.CloudServer} cloudServer
 * @implements {cobu.wsc.ServiceMessageHandler}
 */
cobu.wsc.StartInstanceRequestHandler = function StartInstanceRequestHandler(cloudServer)
{
   'use strict';

   /** @type {cobu.wsc.StartInstanceRequestHandler} */
   var self = this;

   /** Constructor */
   function constructor()
   {
   }

   /**
    * @param {cobu.wsc.WebSocketMessage} message
    * @param {cobu.wsc.WebSocketConnection} connection
    */
   this.handle = function handle(message, connection) {

      try {
         cloudServer.startInstance(message.instanceName);
         connection.send(new cobu.wsc.service.StartInstanceResponse());
      } catch (ex) {
         cloudServer.serviceInstance.log.error(ex.message);
      }
   };

   constructor();
};/**
 * StopInstanceRequestHandler
 * @constructor
 * @param {cobu.wsc.CloudServer} cloudServer
 * @implements {cobu.wsc.ServiceMessageHandler}
 */
cobu.wsc.StopInstanceRequestHandler = function StopInstanceRequestHandler(cloudServer)
{
   'use strict';

   /** @type {cobu.wsc.StartInstanceRequestHandler} */
   var self = this;

   /** Constructor */
   function constructor()
   {
   }

   /**
    * @param {cobu.wsc.WebSocketMessage} message
    * @param {cobu.wsc.WebSocketConnection} connection
    */
   this.handle = function handle(message, connection) {

      try {
         cloudServer.stopInstance(message.instanceName);
         connection.sendAsJson(new cobu.wsc.service.StartInstanceResponse());
      } catch (ex) {
         cloudServer.serviceInstance.log.error(ex.message);
      }
   };

   constructor();
};/**
 * UpdateInstanceRequestHandler
 * @constructor
 * @param {cobu.wsc.CloudServer} cloudServer
 * @implements {cobu.wsc.ServiceMessageHandler}
 */
cobu.wsc.UpdateInstanceRequestHandler = function UpdateInstanceRequestHandler(cloudServer)
{
   'use strict';

   /** @type {cobu.wsc.CreateInstanceRequestHandler} */
   var self = this;

   /** Constructor */
   function constructor()
   {
   }

   /**
    * @param {cobu.wsc.service.UpdateInstanceRequest} message
    * @param {cobu.wsc.WebSocketConnection} connection
    */
   this.handle = function handle(message, connection) {

      try {

         var foundInstance = checkInstanceName(message.instanceName);

         if (foundInstance) {
            var instance = new cobu.wsc.WebSocketInstance(message.name, message.port, cloudServer);
            instance.description = message.description;
            instance.plugins = message.plugins;

            console.log('updateInstance', instance);
            cloudServer.removeInstance(message.instanceName);
            cloudServer.addInstance(instance);

            connection.send(new cobu.wsc.service.UpdateInstanceResponse());
         } else {
            var response = new cobu.wsc.service.UpdateInstanceResponse();
            response.success = false;
            response.message = 'No instance with name ' + message.name + ' found';
            connection.send(response);
         }
      } catch (ex) {
         cloudServer.serviceInstance.log.error(ex.message);
      }
   };

   /**
    * Check if instance name is already in use.
    * @param {string} name
    */
   function checkInstanceName(name) {

      var isNameAlreadyUsed = false;
      var instances = cloudServer.getInstances();

      for(var i=0; i<instances.length; i++) {
         if (instances[i].name.trim() === name.trim()) {
            isNameAlreadyUsed = true;
            break;
         }
      }

      return isNameAlreadyUsed;
   }

   constructor();
};/**
 * CreatePluginRequestHandler
 * @constructor
 * @param {cobu.wsc.CloudServer} cloudServer
 * @implements {cobu.wsc.ServiceMessageHandler}
 */
cobu.wsc.CreatePluginRequestHandler = function CreatePluginRequestHandler(cloudServer)
{
   'use strict';

   /** Constructor */
   function constructor() {
   }

   /**
    * @param {cobu.wsc.service.CreatePluginRequest} message
    * @param {cobu.wsc.WebSocketConnection} connection
    */
   this.handle = function handle(message, connection) {

      try {
         if (cloudServer.pluginManager.hasPlugin(message.name)) {
            sendPluginAlreadyExistsResponse(connection);
         } else {
            cloudServer.pluginManager.createOrUpdatePlugin(message.name, message.description, message.code);
            sendSuccessResponse(connection);
         }
      } catch (ex) {
         cloudServer.serviceInstance.log.error(ex.message);
      }
   };

   /**
    * Send success response
    * @param {cobu.wsc.WebSocketConnection} connection
    */
   function sendSuccessResponse(connection) {
      var response = new cobu.wsc.service.CreatePluginResponse();
      connection.send(response);
   }

   /**
    * Send an error response
    * @param {cobu.wsc.WebSocketConnection} connection
    */
   function sendPluginAlreadyExistsResponse(connection) {
      var response = new cobu.wsc.service.CreatePluginResponse();
      response.success = false;
      response.message = 'Cannot create plugin: Name is already used.';
      connection.send(response);
   }

   constructor();
};/**
 * GetPluginsRequestHandler
 * @constructor
 * @param {cobu.wsc.CloudServer} cloudServer
 * @implements {cobu.wsc.ServiceMessageHandler}
 */
cobu.wsc.GetPluginsRequestHandler = function GetPluginsRequestHandler(cloudServer)
{
   'use strict';

   /** @type {cobu.wsc.GetPluginsRequestHandler} */
   var self = this;

   /** Constructor */
   function constructor() {
   }

   /**
    * @param {cobu.wsc.WebSocketMessage} message
    * @param {cobu.wsc.WebSocketConnection} connection
    */
   this.handle = function handle(message, connection) {

      try {
         var plugins = cloudServer.pluginManager.getPlugins();

         var response = new cobu.wsc.service.GetPluginsResponse();

         for(var i=0; i < plugins.length; i++) {
            var plugin = plugins[i];

            var pluginInfo = new cobu.wsc.service.PluginInfo();
            pluginInfo.name = plugin.name;
            pluginInfo.description = plugin.description;
            pluginInfo.code = plugin.code;

            response.plugins.push(pluginInfo);
         }
         console.log(response);
         connection.send(response);
      } catch (ex) {
         cloudServer.serviceInstance.log.error(ex.message);
      }
   };

   constructor();
};/**
 * RemovePluginRequestHandler
 * @constructor
 * @param {cobu.wsc.CloudServer} cloudServer
 * @implements {cobu.wsc.ServiceMessageHandler}
 */
cobu.wsc.RemovePluginRequestHandler = function RemovePluginRequestHandler(cloudServer)
{
   'use strict';

   /** Constructor */
   function constructor() {
   }

   /**
    * @param {cobu.wsc.service.RemovePluginRequest} message
    * @param {cobu.wsc.WebSocketConnection} connection
    */
   this.handle = function handle(message, connection) {

      try {
         if (cloudServer.pluginManager.hasPlugin(message.pluginName)) {
            cloudServer.pluginManager.removePlugin(message.pluginName);
            sendSuccessResponse(connection);
         } else {
            sendPluginNotFoundResponse(message, connection);
         }
      } catch (ex) {
         cloudServer.serviceInstance.log.error(ex.message);
      }
   };

   /**
    * Send success response
    * @param {cobu.wsc.WebSocketConnection} connection
    */
   function sendSuccessResponse(connection) {
      var response = new cobu.wsc.service.RemovePluginResponse();
      connection.send(response);
   }

   /**
    * Send an error response
    * @param {cobu.wsc.WebSocketConnection} connection
    * @param {cobu.wsc.RemovePluginRequest} message
    */
   function sendPluginNotFoundResponse(message, connection) {
      var response = new cobu.wsc.service.RemovePluginResponse();
      response.success = false;
      response.message = 'Can not find plugin: ' + message.pluginName;
      connection.send(response);
   }

   constructor();
};/**
 * UpdatePluginRequestHandler
 * @constructor
 * @param {cobu.wsc.CloudServer} cloudServer
 * @implements {cobu.wsc.ServiceMessageHandler}
 */
cobu.wsc.UpdatePluginRequestHandler = function UpdatePluginRequestHandler(cloudServer)
{
   'use strict';

   /** Constructor */
   function constructor() {
   }

   /**
    * @param {cobu.wsc.service.UpdatePluginRequest} message
    * @param {cobu.wsc.WebSocketConnection} connection
    */
   this.handle = function handle(message, connection) {

      try {
         if (cloudServer.pluginManager.hasPlugin(message.pluginName)) {
            cloudServer.pluginManager.removePlugin(message.pluginName);
            cloudServer.pluginManager.createOrUpdatePlugin(message.name, message.description, message.code);
            sendSuccessResponse(connection);
         } else {
            sendPluginNotFoundResponse(message, connection);
         }
      } catch (ex) {
         cloudServer.serviceInstance.log.error(ex.message);
      }
   };

   /**
    * Send success response
    * @param {cobu.wsc.WebSocketConnection} connection
    */
   function sendSuccessResponse(connection) {
      var response = new cobu.wsc.service.UpdatePluginResponse();
      connection.send(response);
   }

   /**
    * Send an error response
    * @param {cobu.wsc.WebSocketConnection} connection
    * @param {cobu.wsc.RemovePluginRequest} message
    */
   function sendPluginNotFoundResponse(message, connection) {
      var response = new cobu.wsc.service.RemovePluginResponse();
      response.success = false;
      response.message = 'Can not find plugin: ' + message.pluginName;
      connection.send(response);
   }

   constructor();
};/**
 * ServiceInstance
 * @interface
 * @param {cobu.wsc.CloudServer} cloudServer
 * @param {string} name
 * @param {number} port
 * @implements {cobu.wsc.ServerInstance}
 */
cobu.wsc.ServiceInstance = function ServiceInstance(name, port, cloudServer)
{
   'use strict';

   var WebSocketServer = require('ws').Server;

   /** @type {cobu.wsc.WebSocketInstance} */
   var self = this;

   var server = null;

   /**
    * @type {cobu.wsc.Logger}
    */
   var log = new cobu.wsc.Logger(self.constructor.name);

   /**
    * @type {cobu.wsc.ServiceWorker}
    */
   var serviceWorker = null;

   /**
    * @type {Object.<string, cobu.wsc.WebSocketConnection>}
    */
   var connections = {};

   /**
    * The unique instance name.
    * @type {null}
    */
   this.name = 'service';

   /**
    * Description
    * @type {string}
    */
   this.description = 'internal service instance';

   /**
    * Server port
    * @type {number} default: 8790;
    */
   this.port = port || 8790;

   /**
    * @type {cobu.wsc.Logger}
    */
   this.log = log;

   /**
    * Constructor
    */
   function constructor() {
      serviceWorker = new cobu.wsc.ServiceWorker(cloudServer);
   }

   /**
    * Start instance.
    */
   this.start = function start() {
      log.info('Start service Instance.');
      startServer();
   };

   /**
    * Stop instance.
    */
   this.stop = function stop() {
      try {
         if (server) {
            self.log.info('Stopping ServiceInstance...');
            server.close();
            server = null;
         }
      } catch (ex) {
         self.log.error('Could not stop instance: ', ex);
      }
   };


   /**
    * Start the web socket.
    */
   function startServer() {
      log.info('Start web socket.');
      server = new WebSocketServer({port: self.port});
      server.on('connection', handleConnection);
   }

   /**
    * Creates a handler function to handle connection events.
    */
   function handleConnection(socket) {

      var connection = new cobu.wsc.WebSocketConnection();
      connection.socket = socket;

      log.info('connected ' + connection.id);

      connections[connection.id] = connection;

      socket.on('close', function() {
         log.info('onclose ' + connection.id);
         connections[connection.id] = null;
      });

      socket.on('message', createMessageHandler(connection));
   }

   /**
    * @param {cobu.wsc.WebSocketConnection} connection
    * @returns {Function}
    */
   function createMessageHandler(connection) {

      return function handleMessage(data, flags) {
         log.info('message ' + connection.id + ', ' + data);
         serviceWorker.onMessage(new cobu.wsc.WebSocketMessage(data), connection, self);
      }
   }

   constructor();
};/**
 * ServiceMessageHandler
 * @interface
 */
cobu.wsc.ServiceMessageHandler = function ServiceMessageHandler()
{
   'use strict';

   /**
    * @param {object} message
    * @param {cobu.wsc.WebSocketConnection} connection
    */
   this.handle = function handle(message, connection) {};
};/**
 * ServicePlugin
 * @constructor
 * @implements {cobu.wsc.PluginWorker}
 * @param {cobu.wsc.CloudServer} cloudServer
 */
cobu.wsc.ServiceWorker = function ServiceWorker(cloudServer)
{
   'use strict';

   /** @type {cobu.wsc.PingPongPluginWorker} */
   var self = this;

   this.name = self.constructor.name;

   /**
    * @type {cobu.wsc.Logger}
    */
   var log = new cobu.wsc.Logger(self.constructor.name);

   var apiMap = {};

   /** Constructor */
   function constructor() {
      apiMap['request.startInstance'] = new cobu.wsc.StartInstanceRequestHandler(cloudServer);
      apiMap['request.stopInstance'] = new cobu.wsc.StopInstanceRequestHandler(cloudServer);
      apiMap['request.getInstances'] = new cobu.wsc.GetInstancesRequestHandler(cloudServer);
      apiMap['request.createInstance'] = new cobu.wsc.CreateInstanceRequestHandler(cloudServer);
      apiMap['request.updateInstance'] = new cobu.wsc.UpdateInstanceRequestHandler(cloudServer);
      apiMap['request.removeInstance'] = new cobu.wsc.RemoveInstanceRequestHandler(cloudServer);

      apiMap['request.getPlugins'] = new cobu.wsc.GetPluginsRequestHandler(cloudServer);
      apiMap['request.createPlugin'] = new cobu.wsc.CreatePluginRequestHandler(cloudServer);
      apiMap['request.removePlugin'] = new cobu.wsc.RemovePluginRequestHandler(cloudServer);
      apiMap['request.updatePlugin'] = new cobu.wsc.UpdatePluginRequestHandler(cloudServer);
   }

   /**
    * @param {cobu.wsc.WebSocketConnection} connection
    */
   this.onNewConnection = function onNewConnection(connection) {};

   /**
    * @param {cobu.wsc.WebSocketMessage} message
    * @param {cobu.wsc.WebSocketConnection} connection
    * @param {cobu.wsc.WebSocketInstance} instance
    */
   this.onMessage = function onMessage(message, connection, instance) {

      try {
         log.info('onMessage ' + message.data);
         var msg = JSON.parse(message.data);

         if (msg.type) {
            if (apiMap.hasOwnProperty(msg.type)) {
               apiMap[msg.type].handle(msg, connection);
            }
         }
      } catch (ex) {
         console.log(ex);
         console.log(ex.stack);
         log.error(ex.message);
      }
   };

   constructor();
};
console.log('start server');

var cloudServer = new cobu.wsc.CloudServer();

var serviceInstance = new cobu.wsc.ServiceInstance('service', 8790, cloudServer);
cloudServer.start(serviceInstance);


var instanceA = new cobu.wsc.WebSocketInstance('A', 8081, cloudServer);
instanceA.description = 'test-csu';
instanceA.plugins.push('echo');
instanceA.plugins.push('console');
//instanceA.plugins.push(new cobu.wsc.PingPongPluginWorker());
//instanceA.plugins.push(new cobu.wsc.BroadcastPluginWorker());


var instanceB = new cobu.wsc.WebSocketInstance('B', 8082, cloudServer);
//instanceB.plugins.push(new cobu.wsc.PingPongPluginWorker());
//instanceB.plugins.push(new cobu.wsc.EchoPluginWorker());


cloudServer.pluginManager.createOrUpdatePlugin('console', 'Hello World console output', 'function HelloWorld() { this.onMessage = function onMessage(message, connection, instance) { console.log("hello world"); }; }');

var echoPlugin = new cobu.wsc.Plugin();
echoPlugin.name = 'echo';
echoPlugin.description = 'Echo service. Every received message will be returned.';
echoPlugin.PluginWorker = cobu.wsc.EchoPluginWorker;
echoPlugin.code = cobu.wsc.EchoPluginWorker.toString();

cloudServer.pluginManager.addOrUpdatePlugin(echoPlugin);

var pingpongPlugin = new cobu.wsc.Plugin();
pingpongPlugin.name = 'ping-pong';
pingpongPlugin.description = 'ping will be answered with pong';
pingpongPlugin.PluginWorker = cobu.wsc.PingPongPluginWorker;
pingpongPlugin.code = cobu.wsc.PingPongPluginWorker.toString();

cloudServer.pluginManager.addOrUpdatePlugin(pingpongPlugin);


//instanceA.plugins.push(cloudServer.pluginManager.createPluginWorker('echo'));
//instanceA.plugins.push(cloudServer.pluginManager.createPluginWorker('console'));

cloudServer.addInstance(instanceA);
cloudServer.addInstance(instanceB);

console.log('server initialized. running...');




