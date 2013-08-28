/**
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
};