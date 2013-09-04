/**
 * WebSocketInstance
 * @constructor
 * @implements {cobu.wsc.ServerInstance}
 * @param {cobu.wsc.CloudServer} cloudServer
 * @param {number} [port]
 * @param {string} [name] Unique instance name.
 */
cobu.wsc.WebSocketInstance = function WebSocketInstance(cloudServer, name, port) {

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
    this.name = name || '';

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
                terminatePlugins();
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
     * @param {cobu.wsc.PluginWorker} worker
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
     * @param {cobu.wsc.PluginWorker} worker
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

        log.info('New client connected: ' + connection.id);

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

            log.info('Received message from: ' + connection.id + ', data: ' + data);

            for(var i=0; i<pluginWorkers.length; i++) {
                pluginWorkerOnMessage(pluginWorkers[i], data, connection);
            }
        };
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
                self.log.info(pluginWorker.name + 'call onMessage.');
                pluginWorker.onMessage(new cobu.wsc.WebSocketMessage(data), connection, self);
            } catch (ex) {
                self.log.warn('PluginWorker ' + pluginWorker.name + 'onMessage(...) failed.', ex);
            }
        } else {
            self.log.warn('PluginWorker ' + pluginWorker.name + ' has no method onMessage.');
        }
    }

    constructor();
};