'use strict';

/* eslint-disable no-empty-function, no-unused-vars */

/**
 * Every received message will be sent to all connected clients.
 * Client A, B and C are connected to a WebSocket server instance with this plugin.
 * When A sends a message then it will be sent to B and C, but not back to A.
 * @constructor
 * @struct
 */
function BroadcastPlugin(context) {
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
        // Get all connections to this instance.
        let connections = context.instance.getConnections();

        for (let i = 0; i < connections.length; i++) {
            let conn = connections[i];

            if (conn.id !== connection.id) {
                context.log.debug('Sending message to ' + connection.id);
                conn.send(message.data);
            }
        }
    };

    /**
     * Connection closed event. Note that the connection is no longer part of instance.getConnections().
     * @param {WebSocketConnection} connection
     */
    this.onConnectionClosed = function onConnectionClosed(connection) {};

    this.onStop = function onStop(instance) {};
}

module.exports = {
    name: 'broadcast',
    description: 'Every received message will be sent to all connected clients.',
    createWorker: context => new BroadcastPlugin(context)
};

