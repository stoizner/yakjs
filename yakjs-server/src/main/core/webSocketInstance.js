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

    /**
     * WebSocketServer instance
     * @type {null}
     */
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
     * Start instance after server started.
     * @type {boolean}
     */
    this.autoStartEnabled = false;

    /**
     * @type {Array.<yak.PluginWorker>}
     */
    var pluginInstances = [];

    /**
     * Constructor
     */
    function constructor() {
    }

    /**
     * Start server instance
     */
    this.start = function start() {
        log.info('Start WebSocketServer Instance', { name: self.name });
        try {
            if (self.state !== yak.InstanceState.RUNNING) {
                instantiatePlugins();
                startServer();
                self.state = yak.InstanceState.RUNNING;
            } else {
                log.info('Can not start, Instance already running.', { name: self.name });
            }
        } catch (ex) {
            log.error('Could not start instance: ', { error: ex.message, ex: ex, stack: ex.stack });
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
                log.info('Stopping WebSocket Instance.');
                server.close();
                server = null;
                self.state = yak.InstanceState.STOPPED;
            }
        } catch (ex) {
            log.error('Could not stop instance: ', { error: ex.message, ex: ex, stack: ex.stack });
            self.state = yak.Instanceyake.ERROR;
        }
    };

    /**
     * Start the web socket.
     */
    function startServer() {
        log.info('Start websocket server instance.', { port: self.port });
        server = new WebSocketServer({port: self.port});
        server.on('connection', handleConnection);
    }

    /**
     * Initialize plugins.
     */
    function instantiatePlugins() {
        log.info('Instantiate and initialize plugins.', { count: self.plugins.length });
        pluginInstances = [];

        for(var i=0; i<self.plugins.length; i++) {
            var pluginName = self.plugins[i].trim();

            log.info('Instantiate plugin.', { plugin: pluginName });
            var plugin = yakServer.pluginManager.createPluginInstance(pluginName);

            if (plugin !== null) {

                // Extend with pluginName
                plugin.name = pluginName;

                // A termination fail, shall not stop the loop, so
                // that other plugins can be terminated.
                try {
                    initializePlugin(plugin);
                } catch (ex) {
                    log.error('Initialization failed.', { plugin: pluginName });
                    log.debug({ error: ex.message });
                }
            } else {
                log.error('Plugin could not be loaded.', { plugin: pluginName });
            }
        }
    }

    /**
     * @param {yak.PluginWorker} plugin
     */
    function initializePlugin(plugin) {
        log.info('Initialize plugin.', { plugin: plugin.name });
        if (plugin.hasOwnProperty('onInitialize')) {
            plugin.onInitialize(self);

            // Add plugin instance to workers.
            pluginInstances.push(plugin);

            log.info('Plugin initialized.', { plugin: plugin.name });
        } else {
            log.info('Plugin has no onInitialize function - skipped.', { plugin: plugin.name });
        }
    }

    /**
     * Terminate plugins.
     */
    function terminatePlugins() {
        log.info('Terminate all plugins.', { count: self.plugins.length });
        pluginInstances = [];

        for(var i=0; i<pluginInstances.length; i++) {
            var pluginInstance = pluginInstances[i];

            // A termination fail, shall not stop the loop, so
            // that other plugins can be terminated.
            try {
                terminatePlugin(pluginInstance);
            } catch (ex) {
                log.error('Could not terminate plugin', { plugin: pluginInstance.name, error: ex, stack: ex.stack });
            }
        }
    }

    /**
     * @param {yak.PluginWorker} pluginInstance
     */
    function terminatePlugin(pluginInstance) {
        log.info('Terminate plugin.', { plugin: pluginInstance.name });

        if (pluginInstance.hasOwnProperty('onTerminate')) {
            pluginInstance.onTerminate(self);
            log.info('Plugin terminated.', { plugin: pluginInstance.name });
        } else {
            log.info('Plugin has no onTerminate function - skipped.', { plugin: pluginInstance.name });
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

        log.info('New client connected', { connectionId: connection.id });

        connections[connection.id] = connection;

        socket.on('close', function() {
            self.log.info('Connection closed ', { connectionId: connection.id });
            delete connections[connection.id];
        });

        socket.on('error', function() {
            self.log.info('Connection closed with error' , { connectionId: connection.id });
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

            log.info('Received websocket message ', { fromConnectionId: connection.id, data: data });

            for(var i=0; i<pluginInstances.length; i++) {
                pluginOnMessage(pluginInstances[i], data, connection);
            }
        };
    }

    /**
     *
     * @param {yak.PluginWorker} pluginInstance
     * @param {string} data
     * @param {yak.WebSocketConnection} connection
     */
    function pluginOnMessage(pluginInstance, data, connection) {

        if (pluginInstance.onMessage) {
            try {
                self.log.info('Plugin.onMessage', { pluginName: pluginInstance.name });
                pluginInstance.onMessage(new yak.WebSocketMessage(data), connection, self);
            } catch (ex) {
                self.log.error('Plugin.onMessage failed.', { pluginName: pluginInstance.name, error: ex.name, message:ex.message });
            }
        } else {
            self.log.warn('Plugin.onMessage(data, connection, instance) not found.', { pluginName: pluginInstance.name });
        }
    }

    constructor();
};