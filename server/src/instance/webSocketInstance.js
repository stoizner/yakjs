/**
 * WebSocketInstance
 * @constructor
 * @implements {yak.Instance}
 * @param {yak.PluginManager} pluginManager
 * @param {string} id Unique instance id.
 * @param {number} port The port number to use.
 */
yak.WebSocketInstance = function WebSocketInstance(pluginManager, id, port) {
    'use strict';

    /**
     * @type {?}
     */
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
     * @type {Object<string, yak.WebSocketConnection>}
     */
    var connections = {};

    /**
     * The instance id.
     * @type {string}
     */
    this.id = id || '';

    /**
     * Instance name.
     * @type {string}
     */
    this.name = '';

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
     * @type {Array<string>}
     */
    this.plugins = [];

    /**
     * @type {yak.Logger}
     */
    var log = new yak.Logger(id + '.instance');

    /**
     * Expose logger.
     * @type {yak.Logger}
     */
    this.log = log;

    /**
     * @type {!yak.InstanceState}
     */
    this.state = yak.InstanceState.STOPPED;

    /**
     * If state is in error, more information about the error.
     * @type {?string}
     */
    this.error = null;

    /**
     * Number of active plugins.
     * @type {number}
     */
    this.activePluginCount = 0;

    /**
     * @type {Array<yak.PluginWorker>}
     */
    var pluginInstances = [];

    /**
     * Start server instance
     */
    this.start = function start() {
        log.info('Start WebSocketServer Instance', {id: self.id});
        try {
            if (self.state !== yak.InstanceState.RUNNING) {
                instantiatePlugins();
                startServer();
                self.state = yak.InstanceState.RUNNING;
            } else {
                log.info('Can not start, instance already running.', {id: self.id});
            }
        } catch (ex) {
            log.error('Could not start instance: ', {error: ex.message, ex: ex, stack: ex.stack});
            self.state = yak.InstanceState.ERROR;
        }
    };

    /**
     * Stop server instance.
     */
    this.stop = function stop() {
        log.info('Stop WebSocketServer Instance', {name: self.name, state: self.state});
        try {
            if (server && self.state === yak.InstanceState.RUNNING) {
                self.state = yak.InstanceState.STOPPING;
                self.activePluginCount = 0;
                terminatePlugins();
                server.close();
                server = null;
                self.state = yak.InstanceState.STOPPED;
            }
        } catch (ex) {
            log.info('Could not stop instance, maybe instance is not running.', {error: ex.message, ex: ex, stack: ex.stack});
            self.state = yak.InstanceState.STOPPED;
        }
    };

    /**
     * Start the web socket.
     */
    function startServer() {
        log.info('Start websocket server instance.', {port: self.port});
        server = new WebSocketServer({port: self.port});
        server.on('connection', handleConnection);
        server.on('error', handleError);
    }

    /**
     * @param {?} error
     */
    function handleError(error) {
        if (error.code === 'EADDRINUSE') {
            self.state = yak.InstanceState.ERROR;
            self.error = 'Port is already in use.';
        } else {
            self.state = yak.InstanceState.ERROR;
            self.error = 'net error ' + error.code;
        }

        log.info('Handle instance error.', {id: self.id, state: self.state, error: self.error});
    }

    /**
     * Initialize plugins.
     */
    function instantiatePlugins() {
        log.debug('Instantiate and initialize plugins.', {count: self.plugins.length});

        self.activePluginCount = 0;
        pluginInstances = [];

        self.plugins.forEach(function instantiatePlugin(pluginId) {
            log.debug('Instantiate plugin.', {plugin: pluginId});

            var pluginContext = new yak.PluginContext();
            pluginContext.instance = self;
            var pluginInstance = pluginManager.createPluginInstance(pluginId, pluginContext);

            if (pluginInstance !== null) {
                // Extend with pluginName
                pluginInstance.name = pluginId;

                // When one plugin instantiation fails, it shall continue with the next plugin.
                try {
                    initializePlugin(pluginInstance);
                    pluginInstances.push(pluginInstance);
                    self.activePluginCount++;
                } catch (ex) {
                    log.warn('Plugin start/initialize failed.', {plugin: pluginId, error: ex.message});
                }
            } else {
                log.error('Plugin could not be loaded.', {plugin: pluginId});
            }

            return pluginInstance;
        });
    }

    /**
     * @param {yak.PluginWorker} plugin
     */
    function initializePlugin(plugin) {
        log.debug('Initialize plugin.', {plugin: plugin.name});

        var pluginLog = new yak.Logger(plugin.name + '.plugin');

        if (plugin.hasOwnProperty('onInitialize')) {
            try {
                plugin.onInitialize(self);

                pluginLog.info('Plugin initialized.');
                log.debug('Plugin initialized.', {plugin: plugin.name});
            } catch (ex) {
                pluginLog.error('Plugin initialized failed.', {error: ex.message});
                log.warn('Plugin initialized failed.', {plugin: plugin.name, error: ex.message});
                throw ex;
            }
        }
    }

    /**
     * Terminate plugins.
     */
    function terminatePlugins() {
        log.debug('Terminate all plugins.', {count: self.plugins.length});

        _.each(pluginInstances, function saveTerminatePlugin(pluginInstance) {
            // A termination fail, shall not stop the loop, so
            // that other plugins can be terminated.
            try {
                terminatePlugin(pluginInstance);
            } catch (ex) {
                log.error('Could not terminate plugin', {plugin: pluginInstance.name, error: ex, stack: ex.stack});
            }
        });

        pluginInstances = [];
    }

    /**
     * @param {yak.PluginWorker} pluginInstance
     */
    function terminatePlugin(pluginInstance) {
        var pluginLog = new yak.Logger(pluginInstance.name + '.plugin');

        log.info('Terminate plugin.', {plugin: pluginInstance.name});

        if (pluginInstance.hasOwnProperty('onTerminate')) {
            pluginInstance.onTerminate(self);
            pluginLog.info('Plugin terminated.');
        } else {
            pluginLog.info('Plugin has no onTerminate function - skipped.', {plugin: pluginInstance.name});
        }
    }

    /**
     * Get all connections.
     * @returns {Array<yak.WebSocketConnection>} List of websocket connections.
     */
    this.getConnections = function getConnections() {
        return _.toArray(connections);
    };

    /**
     * @returns {Array<yak.PluginWorker>} List of instantiated plugins.
     */
    this.getPluginInstances = function getPluginInstances() {
        return pluginInstances;
    };

    /**
     * Creates a handler function to handle connection events.
     * @param {?} socket
     */
    function handleConnection(socket) {

        var connection = new yak.WebSocketConnection();
        connection.socket = socket;

        log.info('New client connected', {connectionId: connection.id});

        connections[connection.id] = connection;

        socket.on('close', function handleClose() {
            self.log.info('Connection closed ', {connectionId: connection.id});
            delete connections[connection.id];

            pluginsOnConnectionClosed(connection);
        });

        socket.on('error', function handleError() {
            self.log.info('Connection closed with error' , {connectionId: connection.id});
            delete connections[connection.id];

            pluginsOnConnectionClosed(connection);
        });

        socket.on('message', createMessageHandler(connection));

        pluginsOnNewConnection(connection);
    }

    /**
     * @param {yak.WebSocketConnection} connection
     * @returns {Function} Message handler function.
     */
    function createMessageHandler(connection) {
        return function handleMessage(data, flags) {
            log.debug('Received websocket message ', {fromConnectionId: connection.id, data: data});

            for(var i = 0; i < pluginInstances.length; i++) {
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
        var pluginLog = new yak.Logger(pluginInstance.name + '.plugin');

        if (pluginInstance.onMessage) {
            try {
                pluginLog.info('onMessage', {pluginName: pluginInstance.name});
                pluginInstance.onMessage(new yak.WebSocketMessage(data), connection);
            } catch (ex) {
                pluginLog.error('onMessage failed', {error: ex.message, data: data, connectionId: connection.id});
                log.warn('onMessage failed @' + pluginInstance.name, {error: ex.message, data: data, connectionId: connection.id});
            }
        }
    }

    /**
     * Notify all plugins that a new connection has been established
     * @param {yak.WebSocketConnection} connection
     */
    function pluginsOnNewConnection(connection) {
        _.each(pluginInstances, function callOnNewConnection(pluginInstance) {
            var pluginLog = new yak.Logger(pluginInstance.name + '.plugin');

            if (pluginInstance.onNewConnection) {
                try {
                    pluginLog.info('onNewConnection', {connectionId: connection.id});
                    pluginInstance.onNewConnection(connection);
                } catch (ex) {
                    pluginLog.error('onNewConnection failed.', {error: ex.message, connectionId: connection.id});
                    log.warn('onNewConnection failed @' + pluginInstance.name, {error: ex.message, connectionId: connection.id});
                }
            }
        });
    }

    /**
     * Notify all plugins that a connection has been closed
     * @param {yak.WebSocketConnection} connection
     */
    function pluginsOnConnectionClosed(connection) {
        _.each(pluginInstances, function callOnConnectionClosed(pluginInstance) {
            if (pluginInstance.onConnectionClosed) {
                try {
                    self.log.info('Plugin.onConnectionClosed', {pluginName: pluginInstance.name});
                    pluginInstance.onConnectionClosed(connection);
                } catch (ex) {
                    self.log.error('Plugin.onConnectionClosed failed.', {pluginName: pluginInstance.name, error: ex.name, message:ex.message});
                }
            }
        });
    }
};
