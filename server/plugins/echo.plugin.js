'use strict';

/* eslint-disable no-empty-function, no-unused-vars */

/**
 * @constructor
 * @struct
 * @extends {PluginWorker}
 */
function EchoPlugin() {
    this.onStart = function onStart() {};

    /**
     * @param {WebSocketConnection} connection
     */
    this.onNewConnection = function onNewConnection(connection) {};

    /**
     * @param {WebSocketMessage} message
     * @param {WebSocketConnection} connection
     */
    this.onMessage = function onMessage(message, connection) {
        connection.send(message.data);
    };

    /**
     * Connection closed event. Note that the connection is no longer part of instance.getConnections().
     * @param {WebSocketConnection} connection
     */
    this.onConnectionClosed = function onConnectionClosed(connection) {};

    this.onStop = function onStop() {};
}

/**
 * @type {!Plugin}
 */
module.exports = {
    name: 'echo',
    description: 'Every received message will be send back',
    createWorker: () => new EchoPlugin()
};
