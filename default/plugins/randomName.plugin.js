/**
 * @name randomName
 * @description Creates a random name.
 * @version 1.0.0
 * @constructor
 * @implements {yak.PluginWorker}
 * @param {!yak.require} require
 */
function RandomNamePlugin(require) {
    'use strict';

    var createRandomName = require('randomName').createRandomName;

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
        connection.send(createRandomName());
    };

    /**
     * Connection closed event. Note that the connection is no longer part of instance.getConnections().
     * @param {yak.WebSocketConnection} connection
     */
    this.onConnectionClosed = function onConnectionClosed(connection) {};

    this.onStop = function onStop() {};
}
