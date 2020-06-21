'use strict';

/* eslint-disable no-empty-function, no-unused-vars */

/**
 * @interface
 */
function PluginWorker() {
    /**
     * Called when the instance starts.
     */
    this.onStart = function onStart() {};

    /**
     * Use "onStart" callback instead.
     * @deprecated
     */
    this.onInitialize = function onInitialize() {};

    /**
     * Called when the instance is started and can accept WebSocket connections or HTTP requests.
     * @param {!InstanceStartedEvent} event
     */
    this.onInstanceStarted = function onInstanceStarted(event) {};

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
     */
    this.onStop = function onStop() {};

    /**
     * Use "onStop" callback instead.
     * @deprecated
     */
    this.onTerminate = function onTerminate() {};
}

module.exports = PluginWorker;
