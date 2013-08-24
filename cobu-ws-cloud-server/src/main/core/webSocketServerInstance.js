/**
 * WebSocketServerInstance
 * @constructor
 * @implements {cobu.wsc.ServerInstance}
 * @param {number} [port]
 * @param {string} name Unique instance name.
 */
cobu.wsc.WebSocketServerInstance = function WebSocketServerInstance(name, port)
{
   'use strict';

   var WebSocketServer = require('ws').Server;

   var server = null;

   /** @type {cobu.wsc.WebSocketServerInstance} */
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
    * Unique instance name.
    * @type {string}
    */
   this.name = name;

   /**
    *
    * @type {Array.<cobu.wsc.WebSocketServerPlugin>}
    */
   this.plugins = [];

   /**
    * @type {cobu.wsc.Logger}
    */
   this.log = new cobu.wsc.Logger(self.name);

   /**
    * @type {cobu.wsc.InstanceState}
    */
   this.state = cobu.wsc.InstanceState.STOPPED;

   /** Constructor */
   function constructor() {
   }

   /**
    * Start server instance
    */
   this.start = function start() {

      try {
         if (self.state !== cobu.wsc.InstanceState.RUNNING) {
            self.log.info('Starting WebSocketServerInstance.');
            server = new WebSocketServer({port: self.port});
            server.on('connection', handleConnection);
            self.state = cobu.wsc.InstanceState.RUNNING;
         } else {
            self.log.info('Can not start, Instance already running.');
         }
      } catch (ex) {
         self.log.error('Could not start instance: ' + ex.message);
         self.state = cobu.wsc.InstanceState.ERROR;
      }
   };

   /**
    * Stop server instance.
    */
   this.stop = function stop() {

      try {
         if (server && self.state === cobu.wsc.InstanceState.RUNNING) {
            self.log.info('Stopping WebSocketServerInstance...');
            server.close();
            server = null;
            self.state = cobu.wsc.InstanceState.STOPPED;
         }
      } catch (ex) {
         self.log.error('Could not stop instance: ' + ex.message);
         self.state = cobu.wsc.InstanceState.ERROR;
      }
   };

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

      self.log.info('connected ' + connection.id);

      connections[connection.id] = connection;

      socket.on('close', function() {
         self.log.info('onclose ' + connection.id);
         connections[connection.id] = null;
      });

      socket.on('message', createMessageHandler(connection));
      //socket.onmessage = handleMessage;
   }


   /**
    * @param {cobu.wsc.WebSocketConnection} connection
    * @returns {Function}
    */
   function createMessageHandler(connection) {

      return function handleMessage(data, flags) {
         self.log.info('message ' + connection.id + ', ' + data);

         for(var i=0; i<self.plugins.length; i++) {
            var plugin = self.plugins[i];
            self.log.info(plugin.name + '.onMessage()');

            plugin.onMessage(new cobu.wsc.WebSocketMessage(data), connection, self);
         }
      }
   }

   constructor();
};