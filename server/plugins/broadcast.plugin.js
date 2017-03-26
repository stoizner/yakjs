/**
 * @name broadcast
 * @description Every received message will be sent to all connected clients.
 * @version 1.1.0
 * @type WebSocketServerPlugin
 * @example Client A, B and C are connected to a WebSocket server instance with this plugin.
 *      When A sends a message then it will be sent to B and C, but not back to A.
 * @constructor 
 * @implements 
 * @param require
 */
function BroadcastPlugin(require, context) {
    'use strict';

    var log = require('log');

    this.onStart = function onStart() {};

    /**
     * @param {yak.WebSocketConnection} connection
     */
    this.onNewConnection = function onNewConnection(connection) {};

    /**
     * @param {yak.WebSocketMessage} message
     * @param {yak.WebSocketConnection} connection
     */
    this.onMessage = function onMessage(message, connection) {
        // Get all connections to this instance.
        var connections = context.instance.getConnections();

        for(var i = 0; i < connections.length; i++) {
            var conn = connections[i];

            if (conn.id !== connection.id) {
                log.debug('Sending message to ' + connection.id);
                conn.send(message.data);
            }
        }
    };

    /**
     * Connection closed event. Note that the connection is no longer part of instance.getConnections().
     * @param {yak.WebSocketConnection} connection
     */
    this.onConnectionClosed = function onConnectionClosed(connection) {};

    this.onStop = function onStop(instance) {};
}



