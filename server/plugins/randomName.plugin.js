'use strict';

/* eslint-disable no-empty-function, no-unused-vars */

const createRandomName = require('../modules/randomName').createRandomName;

/**
 * Creates a random name.
 * @constructor
 * @struct
 */
function RandomNamePlugin() {
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

module.exports = {
    name: 'randomName',
    description: 'Creates a random name.',
    createWorker: () => new RandomNamePlugin()
};
