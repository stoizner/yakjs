/**
 * @name pingPong
 * @description For every received 'ping' string, this plugin will send an 'pong' string.
 * @version 1.0.0
 * @constructor
 * @implements {yak.PluginWorker}
 */
function PingPongPlugin() {
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
        if (message.data === 'ping') {
            connection.send('pong');
        }
    };

    /**
     * Connection closed event. Note that the connection is no longer part of instance.getConnections().
     * @param {yak.WebSocketConnection} connection
     */
    this.onConnectionClosed = function onConnectionClosed(connection) {};

    this.onStop = function onStop() {};
}
