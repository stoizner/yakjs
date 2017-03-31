'use strict';

/* eslint-disable no-empty-function, no-unused-vars */

/**
 * @name pingPong
 * @description For every received 'ping' string, this plugin will send an 'pong' string.
 * @version 1.0.0
 * @type WebSocketServerPlugin
 * @constructor
 * @implements
 */
function PingPongPlugin() {
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
        if (message.data === 'ping') {
            connection.send('pong');
        }
    };

    /**
     * Connection closed event. Note that the connection is no longer part of instance.getConnections().
     * @param {WebSocketConnection} connection
     */
    this.onConnectionClosed = function onConnectionClosed(connection) {};

    this.onStop = function onStop() {};
}

