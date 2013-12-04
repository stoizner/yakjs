/**
 * WebSocketInstance
 * @constructor
 * @implements {yak.ServerInstance}
 * @param {yak.YakServer} yakServer
 * @param {number} [port]
 * @param {string} [name] Unique instance name.
 */
yak.WebSocketInstance = function WebSocketInstance(yakServer, name, port) {

    'use strict';

    var WebSocketServer = require('ws').Server;

    /**
     * @type {yak.WebSocketInstance}
     */
    var self = this;

    var server = null;

    /**
    *
    * @type {Object.<string, yak.WebSocketConnection>}
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
    this.name = name || '';

    /**
     * @type {Array.<string>}
     */
    this.plugins = [];

    /**
     * @type {yak.Logger}
     */
    var log = new yak.Logger(name);

    /**
     * Expose logger.
     * @type {yak.Logger}
     */
    this.log = log;

    /**
     * @type {yak.InstanceState}
     */
    this.state = yak.InstanceState.STOPPED;

    /**
     * @type {Array.<yak.PluginWorker>}
     */
    var pluginWorkers = [];

    /**
     * Constructor
     */
    function constructor() {
    }

    /**
     * Start server instance
     */
    this.start = function start() {

        log.info('Start WebSocketServer Instance.');
        try {
            if (self.state !== yak.InstanceState.RUNNING) {
                initializePlugins();
                startServer();
                self.state = yak.InstanceState.RUNNING;
            } else {
                log.info('Can not start, Instance already running.');
            }
        } catch (ex) {
            log.error('Could not start instance: ' + ex.message);
            self.state = yak.InstanceState.ERROR;
        }
    };

    /**
     * Stop server instance.
     */
    this.stop = function stop() {

        try {
            if (server && self.state === yak.InstanceState.RUNNING) {
                self.state = yak.InstanceState.STOPPING;
                terminatePlugins();
                log.info('Stopping WebSocketInstance...');
                server.close();
                server = null;
                self.state = yak.InstanceState.STOPPED;
            }
        } catch (ex) {
            log.error('Could not stop instance: ' + ex.message);
            self.state = yak.Instanceyake.ERROR;
        }
    };

    /**
     * Start the web socket.
     */
    function startServer() {
        log.info('Start websocket server instance on ' + self.port);
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
            var worker = yakServer.pluginManager.createPluginWorker(pluginName);

            if (worker !== null) {

                // Extend with pluginName
                worker.name = pluginName;

                // A termination fail, shall not stop the loop, so
                // that other plugins can be terminated.
                try {
                    initializePlugin(worker);
                } catch (ex) {
                    log.error(worker.name + ' could not be initialized.');
                    log.error(ex);
                    log.error(ex.stack);
                }
            } else {
                log.warn(pluginName + ' not initialized.');
            }
        }
    }

    /**
     * @param {yak.PluginWorker} worker
     */
    function initializePlugin(worker) {
        if (worker.hasOwnProperty('onInitialize')) {
            log.info(worker.name + ' call onInitialize.');

            worker.onInitialize(self);

            // Add plugin instance to workers.
            pluginWorkers.push(worker);

            log.info(worker.name + ' initialized.');
        } else {
            log.info(worker.name + ' has no onInitialize function - skipped.');
        }
    }

    /**
     * Terminate plugins.
     */
    function terminatePlugins() {
        log.info('Terminate ' + self.plugins.length + ' plugins.');
        pluginWorkers = [];

        for(var i=0; i<pluginWorkers.length; i++) {
            var worker = pluginWorkers[i];

            // A termination fail, shall not stop the loop, so
            // that other plugins can be terminated.
            try {
                terminatePlugin(worker);
            } catch (ex) {
                log.error(worker.name + ' could not be terminated.');
                log.error(ex);
                log.error(ex.stack);
            }
        }
    }

    /**
     * @param {yak.PluginWorker} worker
     */
    function terminatePlugin(worker) {
        if (worker.hasOwnProperty('onTerminate')) {
            log.info(worker.name + ' call onTerminate.');
            worker.onTerminate(self);
            log.info(worker.name + ' terminated.');
        } else {
            log.info(worker.name + ' has no onTerminate function - skipped.');
        }
    }

    /**
     * Get all connections.
     * @return {Array.<yak.WebSocketConnection>}
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

        var connection = new yak.WebSocketConnection();
        connection.socket = socket;

        log.info('New client connected: ' + connection.id);

        connections[connection.id] = connection;

        socket.on('close', function() {
            self.log.info('Connection closed: ' + connection.id);
            delete connections[connection.id];
        });

        socket.on('error', function() {
            self.log.info('Connection closed with error: ' + connection.id);
            delete connections[connection.id];
        });

        socket.on('message', createMessageHandler(connection));
    }

    /**
     * @param {yak.WebSocketConnection} connection
     * @returns {Function}
     */
    function createMessageHandler(connection) {

        return function handleMessage(data, flags) {

            log.info('Received message from: ' + connection.id + ', data: ' + data);

            for(var i=0; i<pluginWorkers.length; i++) {
                pluginWorkerOnMessage(pluginWorkers[i], data, connection);
            }
        };
    }

    /**
     *
     * @param {yak.PluginWorker} pluginWorker
     * @param {string} data
     * @param {yak.WebSocketConnection} connection
     */
    function pluginWorkerOnMessage(pluginWorker, data, connection) {

        if (pluginWorker.onMessage) {
            try {
                self.log.info(pluginWorker.name + 'call onMessage.');
                pluginWorker.onMessage(new yak.WebSocketMessage(data), connection, self);
            } catch (ex) {
                self.log.warn('PluginWorker ' + pluginWorker.name + 'onMessage(...) failed.', ex);
            }
        } else {
            self.log.warn('PluginWorker ' + pluginWorker.name + ' has no method onMessage.');
        }
    }

    constructor();
};