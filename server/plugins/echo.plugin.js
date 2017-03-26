/**
 * @name echo
 * @description Every received message will be send back.
 * @version 1.0.0
 * @type WebSocketServerPlugin
 */
function EchoPlugin(require) {
    'use strict';

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
        connection.send(message.data);
    };

    /**
     * Connection closed event. Note that the connection is no longer part of instance.getConnections().
     * @param {yak.WebSocketConnection} connection
     */
    this.onConnectionClosed = function onConnectionClosed(connection) {};

    this.onStop = function onStop() {};
}








