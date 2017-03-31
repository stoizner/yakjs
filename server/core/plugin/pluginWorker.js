'use strict';

/* eslint-disable no-empty-function, no-unused-vars */

/**
 * @interface
 * @param {string} name The name of the plugin.
 */
function PluginWorker(name) {
    /**
     * Plugin name
     * @type {string}
     */
    this.name = name;

    /**
     * Called when the instance is started.
     * @deprecated Since 2.x - Please use onStart
     */
    this.onInitialize = function onInitialize() {};

    /**
     * Called when the instance is started.
     */
    this.onStart = function onStart() {};

    /**
     * Called on new client connected to instance.
     * @param {!WebSocketConnection} connection
     */
    this.onNewConnection = function onNewConnection(connection) {};

    /**
     * Called for every received websocket message.
     * @param {!WebSocketMessage} message
     * @param {!WebSocketConnection} connection
     */
    this.onMessage = function onMessage(message, connection) {};

    /**
     * Called for every received json websocket message.
     * @param {!WebSocketMessage} message
     * @param {!WebSocketConnection} connection
     */
    this.onJsonMessage = function onJsonMessage(message, connection) {};

    /**
     * Connection closed event. Note that the connection is no longer part of instance.getConnections().
     * @param {!WebSocketConnection} connection
     */
    this.onConnectionClosed = function onConnectionClosed(connection) {};

    /**
     * Called when the instance is stopped.
     * @deprecated
     */
    this.onTerminate = function onTerminate() {};

    /**
     * Called when the instance is stopped.
     */
    this.onStop = function onTerminate() {};
}

module.exports = PluginWorker;
