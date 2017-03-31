'use strict';

/* eslint-disable no-empty-function, no-unused-vars */

/**
 * @name randomName
 * @description Creates a random name.
 * @version 0.1.0
 * @type WebSocketServerPlugin
 */
function RandomNamePlugin(require) {
    var createRandomName = require('randomName').createRandomName;

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
        connection.send(createRandomName());
    };

    /**
     * Connection closed event. Note that the connection is no longer part of instance.getConnections().
     * @param {WebSocketConnection} connection
     */
    this.onConnectionClosed = function onConnectionClosed(connection) {};

    this.onStop = function onStop() {};
}
