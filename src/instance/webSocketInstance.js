'use strict';

import ws from 'ws';
import http from 'http';

import express from 'express';
import {InstanceState} from './instanceState.js';
import {PluginContext} from '../plugin/pluginContext.js';
import {WebSocketConnection} from './webSocketConnection.js';
import {WebSocketMessage} from './webSocketMessage.js';
import {magicNumbers as magic} from '../util/magicNumbers.js';

import {InstanceStartedEvent} from './instanceStartedEvent.js';
import {PluginWorkerContainer} from '../plugin/PluginWorkerContainer.js';

/**
 * @constructor
 * @struct
 * @implements {Instance}
 * @param {Service} service
 * @param {YakInstance} yakInstance
 */
export function WebSocketInstance(service, yakInstance) {
    /**
     * @type {WebSocketInstance}
     */
    const self = this;

    const {pluginManager, log, commandDispatcher} = service;

    /**
     * WebSocket instance
     * @type {Server}
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
     * @type {YakInstance}
     */
    this.yakInstance = yakInstance;

    /**
     * Instance name.
     * @type {string}
     */
    this.name = '';

    /**
     * Server port
     * @type {number} default: 8080;
     */
    this.port = yakInstance.port || magic.DEFAULT_HTTP_PORT;

    /**
     * Description
     * @type {string}
     */
    this.description = '';

    /**
     * Expose logger.
     * @type {YakLogger}
     */
    this.log = log;

    /**
     * @type {InstanceState}
     */
    this.state = InstanceState.STOPPED;

    /**
     * If state is in error, more information about the error.
     * @type {?string}
     */
    this.error = null;

    /**
     * @type {Array<PluginWorkerContainer>}
     */
    let containers = [];

    /**
     * @type {PluginContext}
     */
    let pluginContext = null;

    /**
     * @type {Express}
     */
    let expressApp = null;

    /**
     * Start server instance
     * @returns {!Promise}
     */
    this.start = async function start() {
        log.info('Start WebSocket Instance', {id: self.id});

        if (self.state === InstanceState.STARTED) {
            throw new Error(`Can not start, instance already running. (${self.id})`);
        }

        try {
            containers = initializePluginContainers();
            await startServer();
            triggerInstanceStarted();

            self.state = InstanceState.STARTED;
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
        log.info('Stop WebSocket Instance', {name: self.name, state: self.state});

        return new Promise(resolve => {
            if (webSocketServer && self.state === InstanceState.STARTED) {
                self.state = InstanceState.STOPPING;

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

            webSocketServer = new ws.Server({server: webServer});
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
     * @return {Array<PluginWorkerContainer>}
     */
    function initializePluginContainers() {
        log.debug('Initialize plugins.', {count: yakInstance.plugins.length});

        return yakInstance.plugins.map(initializePluginContainer);
    }

    /**
     * @param {YakPlugin} plugin
     * @returns {PluginWorkerContainer}
     */
    function initializePluginContainer(plugin) {
        log.debug('Initialize plugin.', {name: plugin.name});

        const context = getOrCreatePluginContext();
        registerPluginCommands(plugin, context);

        const container = Object.assign(new PluginWorkerContainer(plugin), plugin.createWorker(context));
        triggerStart(container);

        return container;
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

        const commands = plugin.commands || [];
        commands.forEach(command => {
            commandDispatcher.register(command, context);
        });
    }

    /**
     * @param {PluginWorkerContainer} container
     */
    function triggerStart(container) {
        const pluginName = container.yakPlugin.name;
        log.debug('Starting plugin.');

        const callback = container.onStart || container.onInitialize;

        if (callback) {
            try {
                callback();

                log.info('Plugin started.', {instance: self.name});
                log.debug('Plugin started.', {pluginName});
            } catch (error) {
                log.error('Plugin start failed.', {instance: self.name, error: error.message});
                log.warn('Plugin start failed.', {pluginName, error: error.message});
                throw error;
            }
        }
    }

    function triggerInstanceStarted() {
        containers.forEach(pluginWorker => {
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
        log.debug('Stop all plugins.', {count: containers.length});

        containers.forEach(pluginWorker => {
            // A termination fail, shall not stop the loop, so
            // that other plugins can be terminated.
            try {
                triggerStop(pluginWorker);
            } catch (ex) {
                log.error('Could not stop plugin', {plugin: pluginWorker.name, error: ex, stack: ex.stack});
            }
        });

        containers = [];
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
                log.info('Plugin stopped.', {instance: self.name});
                log.debug('Plugin stopped.', {plugin: plugin.name});
            } catch (ex) {
                log.error('Plugin stop failed.', {instance: self.name, error: ex.message});
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
        return containers;
    };

    /**
     * Creates a handler function to handle connection events.
     * @param {?} socket
     */
    function handleConnection(socket) {
        let connection = new WebSocketConnection(service, socket);

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
            log.debug('Received websocket message ', {connectionId: connection.id, data: data});

            containers.forEach(pluginWorker => {
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
                    log.error('Call onJsonMessage failed', {error: ex.message, data: jsonData, connectionId: connection.id});
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
        const callback = pluginWorker.onMessage;

        if (callback) {
            try {
                callback(new WebSocketMessage(data), connection);
            } catch (ex) {
                log.error('Call onMessage failed', {error: ex.message, data: data, connectionId: connection.id});
                log.warn('Call onMessage failed', {instanceId: self.id, plugin: pluginWorker.name, error: ex.message, data: data, connectionId: connection.id});
            }
        }
    }

    /**
     * Notify all plugins that a new connection has been established
     * @param {!WebSocketConnection} connection
     */
    function triggerNewConnection(connection) {
        containers.forEach(pluginWorker => {
            if (pluginWorker.onNewConnection) {
                try {
                    log.info('onNewConnection', {connectionId: connection.id});
                    pluginWorker.onNewConnection(connection);
                } catch (ex) {
                    log.error('onNewConnection failed.', {error: ex.message, connectionId: connection.id});
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
        containers.forEach(pluginWorker => {
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
