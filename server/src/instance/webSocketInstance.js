'use strict';

const WebSocketServer = require('ws').Server;
const http = require('http');

const express = require('express');
const log = require('../infrastructure/logger').defaultLogger;
const pluginLog = require('../infrastructure/logger').pluginLogger;
const InstanceState = require('./instanceState');
const PluginContext = require('../plugin/pluginContext');
const WebSocketConnection = require('./webSocketConnection');
const WebSocketMessage = require('./webSocketMessage');
const magic = require('../util/magicNumbers');
const commandDispatcher = require('../command/commandDispatcher');

const {InstanceStartedEvent} = require('./instanceStartedEvent');

/**
 * @constructor
 * @struct
 * @implements {Instance}
 * @param {!PluginManager} pluginManager
 * @param {string} id Unique instance id.
 * @param {number} port The port number to use.
 */
function WebSocketInstance(pluginManager, id, port) {
    /**
     * @type {WebSocketInstance}
     */
    const self = this;

    /**
     * WebSocketServer instance
     * @type {WebSocketServer}
     */
    let webSocketServer = null;

    /**
     * @type {Server}
     */
    let webServer = null;

    /**
     * @type {!Object<string, WebSocketConnection>}
     */
    const connections = {};

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
    this.port = port || magic.DEFAULT_HTTP_PORT;

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
     * Expose logger.
     * @type {!Log}
     */
    this.log = log;

    /**
     * @type {!InstanceState}
     */
    this.state = InstanceState.STOPPED;

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
     * @type {!Array<!PluginWorker>}
     */
    let pluginWorkers = [];

    /**
     * @type {PluginContext}
     */
    let pluginContext = null;

    /**
     * @type {core.Express}
     */
    let expressApp = null;

    /**
     * Start server instance
     * @returns {!Promise}
     */
    this.start = async function start() {
        log.info('Start WebSocketServer Instance', {id: self.id});

        if (self.state === InstanceState.RUNNING) {
            throw new Error(`Can not start, instance already running. (${self.id})`);
        }

        try {
            instantiatePlugins();
            await startServer();
            self.state = InstanceState.RUNNING;

            triggerInstanceStarted();
        } catch (error) {
            log.error('Could not start instance: ', {error});
            self.state = InstanceState.ERROR;
            throw error;
        }
    };

    /**
     * Stop server instance.
     * @returns {!Promise}
     */
    this.stop = function stop() {
        log.info('Stop WebSocketServer Instance', {name: self.name, state: self.state});

        return new Promise(resolve => {
            if (webSocketServer && self.state === InstanceState.RUNNING) {
                self.state = InstanceState.STOPPING;
                self.activePluginCount = 0;

                commandDispatcher.unregisterAllWithContext(getOrCreatePluginContext());
                stopAllPlugins();

                webSocketServer.close(() => {
                    webSocketServer = null;

                    if (webServer) {
                        webServer.close(() => {
                            webServer = null;
                            self.state = InstanceState.STOPPED;
                            resolve();
                        });
                    } else {
                        resolve();
                    }
                });
            } else {
                resolve();
            }
        }).catch(error => {
            log.info('Could not stop instance, maybe instance is not running.', {error, stack: error.stack});
            self.state = InstanceState.STOPPED;
            throw error;
        });
    };

    /**
     * Start the web socket.
     */
    function startServer() {
        return new Promise((resolve, reject) => {
            log.info('Start WebSocket server instance.', {
                port: self.port
            });

            expressApp = express();
            webServer = http.createServer(expressApp).listen(self.port);

            webSocketServer = new WebSocketServer({server: webServer});
            webSocketServer.on('connection', handleConnection);
            webSocketServer.on('error', error => {
                handleError(error);
                reject(error);
            });
            resolve();
        });
    }

    /**
     * @param {?} error
     */
    function handleError(error) {
        if (error.code === 'EADDRINUSE') {
            self.state = InstanceState.ERROR;
            self.error = 'Port is already in use.';
        } else {
            self.state = InstanceState.ERROR;
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
        pluginWorkers = [];

        self.plugins.forEach(pluginId => {
            log.debug('Instantiate plugin.', {pluginId});

            const pluginWorker = pluginManager.createPluginWorker(pluginId, getOrCreatePluginContext());

            if (pluginWorker) {
                // #HACK Extend with pluginName
                pluginWorker.name = pluginId;
                pluginWorker.pluginId = pluginId;

                // When one plugin instantiation fails, it shall continue with the next plugin.
                try {
                    registerPluginCommands(pluginManager.getPlugin(pluginId), getOrCreatePluginContext());
                    triggerStart(pluginWorker);
                    pluginWorkers.push(pluginWorker);
                    self.activePluginCount++;
                } catch (ex) {
                    log.warn('Plugin start/initialize failed.', {pluginId, error: ex.message});
                }
            } else {
                log.error('Plugin could not be loaded.', {pluginId});
            }

            return pluginWorker;
        });
    }

    /**
     * Gets or creates the plugin context.
     * @returns {!PluginContext}
     */
    function getOrCreatePluginContext() {
        if (!pluginContext) {
            pluginContext = new PluginContext();
            pluginContext.instance = self;
            pluginContext.log = log;
        }

        return pluginContext;
    }

    /**
     * @param {!Plugin} plugin
     * @param {!PluginContext} context
     */
    function registerPluginCommands(plugin, context) {
        log.debug('Register plugin commands', {plugin: plugin.name});

        if (plugin.module && plugin.module.commands) {
            plugin.module.commands.forEach(pluginConfig => {
                commandDispatcher.register(pluginConfig, context);
            });
        }
    }

    /**
     * @param {!PluginWorker} plugin
     */
    function triggerStart(plugin) {
        const pluginName = plugin.name;
        log.debug('Initialize plugin.', {pluginName});

        const callback = plugin.onStart || plugin.onInitialize;

        if (callback) {
            try {
                callback();

                pluginLog.info('Plugin started.', {instance: self.name});
                log.debug('Plugin started.', {pluginName});
            } catch (error) {
                pluginLog.error('Plugin start failed.', {instance: self.name, error: error.message});
                log.warn('Plugin start failed.', {pluginName, error: error.message});
                throw error;
            }
        }
    }

    function triggerInstanceStarted() {
        pluginWorkers.forEach(pluginWorker => {
            if (pluginWorker.onInstanceStarted) {
                const event = new InstanceStartedEvent(expressApp);
                pluginWorker.onInstanceStarted(event);
            }
        });
    }

    /**
     * Stop all plugins.
     */
    function stopAllPlugins() {
        log.debug('Stop all plugins.', {count: self.plugins.length});

        pluginWorkers.forEach(pluginWorker => {
            // A termination fail, shall not stop the loop, so
            // that other plugins can be terminated.
            try {
                triggerStop(pluginWorker);
            } catch (ex) {
                log.error('Could not stop plugin', {plugin: pluginWorker.name, error: ex, stack: ex.stack});
            }
        });

        pluginWorkers = [];
    }

    /**
     * @param {!PluginWorker} plugin
     */
    function triggerStop(plugin) {
        log.info('Stop plugin.', {plugin: plugin.name});

        let callback = plugin.onStop || plugin.onTerminate;

        if (callback) {
            try {
                callback();
                pluginLog.info('Plugin stopped.', {instance: self.name});
                log.debug('Plugin stopped.', {plugin: plugin.name});
            } catch (ex) {
                pluginLog.error('Plugin stop failed.', {instance: self.name, error: ex.message});
                log.warn('Plugin stop failed.', {plugin: plugin.name, error: ex.message});
                throw ex;
            }
        }
    }

    /**
     * Get all connections.
     * @returns {!Array<!WebSocketConnection>} List of websocket connections.
     */
    this.getConnections = function getConnections() {
        return Object.values(connections);
    };

    /**
     * @returns {!Array<!PluginWorker>} List of instantiated plugins.
     */
    this.getPluginInstances = function getPluginInstances() {
        return pluginWorkers;
    };

    /**
     * Creates a handler function to handle connection events.
     * @param {?} socket
     */
    function handleConnection(socket) {
        let connection = new WebSocketConnection(socket);

        log.info('New client connected', {connectionId: connection.id});

        connections[connection.id] = connection;

        socket.on('close', function handleSocketClose() {
            self.log.info('Connection closed ', {connectionId: connection.id});
            delete connections[connection.id];

            triggerConnectionClosed(connection);
        });

        socket.on('error', function handleSocketError() {
            self.log.info('Connection closed with error', {connectionId: connection.id});
            delete connections[connection.id];

            triggerConnectionClosed(connection);
        });

        socket.on('message', createMessageHandler(connection));

        triggerNewConnection(connection);
    }

    /**
     * @param {!WebSocketConnection} connection
     * @returns {Function} Message handler function.
     */
    function createMessageHandler(connection) {
        return function handleMessage(data) {
            log.debug('Received websocket message ', {fromConnectionId: connection.id, data: data});

            pluginWorkers.forEach(pluginWorker => {
                triggerMessage(pluginWorker, data, connection);
                triggerJsonMessage(pluginWorker, data, connection);
            });
        };
    }

    /**
     * @param {!PluginWorker} pluginWorker
     * @param {string} data
     * @param {!WebSocketConnection} connection
     */
    function triggerJsonMessage(pluginWorker, data, connection) {
        const callback = pluginWorker.onJsonMessage;

        if (callback) {
            let jsonData;

            try {
                jsonData = JSON.parse(data);
            } catch (ex) {
                jsonData = null;
            }

            if (jsonData) {
                try {
                    callback(new WebSocketMessage(jsonData), connection);
                } catch (ex) {
                    pluginLog.error('Call onJsonMessage failed', {error: ex.message, data: jsonData, connectionId: connection.id});
                    log.warn('Call onJsonMessage failed', {plugin: pluginWorker.name, error: ex.message, data: jsonData, connectionId: connection.id});
                }
            }
        }
    }

    /**
     * @param {!PluginWorker} pluginWorker
     * @param {string} data
     * @param {!WebSocketConnection} connection
     */
    function triggerMessage(pluginWorker, data, connection) {
        let callback = pluginWorker.onMessage;

        if (callback) {
            try {
                callback(new WebSocketMessage(data), connection);
            } catch (ex) {
                pluginLog.error('Call onMessage failed', {error: ex.message, data: data, connectionId: connection.id});
                log.warn('Call onMessage failed', {plugin: pluginWorker.name, error: ex.message, data: data, connectionId: connection.id});
            }
        }
    }

    /**
     * Notify all plugins that a new connection has been established
     * @param {!WebSocketConnection} connection
     */
    function triggerNewConnection(connection) {
        pluginWorkers.forEach(pluginWorker => {
            if (pluginWorker.onNewConnection) {
                try {
                    pluginLog.info('onNewConnection', {connectionId: connection.id});
                    pluginWorker.onNewConnection(connection);
                } catch (ex) {
                    pluginLog.error('onNewConnection failed.', {error: ex.message, connectionId: connection.id});
                    log.warn('onNewConnection failed @' + pluginWorker.name, {error: ex.message, connectionId: connection.id});
                }
            }
        });
    }

    /**
     * Notify all plugins that a connection has been closed
     * @param {!WebSocketConnection} connection
     */
    function triggerConnectionClosed(connection) {
        pluginWorkers.forEach(pluginWorker => {
            if (pluginWorker.onConnectionClosed) {
                try {
                    self.log.info('Plugin.onConnectionClosed', {pluginName: pluginWorker.name});
                    pluginWorker.onConnectionClosed(connection);
                } catch (ex) {
                    self.log.error('Plugin.onConnectionClosed failed.', {pluginName: pluginWorker.name, error: ex.name, message: ex.message});
                }
            }
        });
    }
}

module.exports = WebSocketInstance;
