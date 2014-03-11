/**
 * EchoPlugin
 * Every received message will be send back.
 * @constructor
 * @implements {yak.PluginWorker}
 */
yak.EchoPlugin = function EchoPlugin(require) {

    'use strict';

    var _ = require('underscore');

    /**
     * @param {yak.WebSocketInstance} instance
     */
    this.onInitialize = function onInitialize(instance) {};

    /**
     * @param {yak.WebSocketConnection} connection
     * @param {yak.WebSocketInstance} instance
     */
    this.onNewConnection = function onNewConnection(connection, instance) {};

    /**
     * @param {yak.WebSocketMessage} message
     * @param {yak.WebSocketConnection} connection
     * @param {yak.WebSocketInstance} instance
     */
    this.onMessage = function onMessage(message, connection, instance) {
        connection.send(message.data);
    };

    /**
     * Connection closed event. Note that the connection is no longer part of instance.getConnections().
     * @param {yak.WebSocketConnection} connection
     * @param {yak.WebSocketInstance} instance
     */
    this.onConnectionClosed = function onConnectionClosed(connection, instance) {};

    /**
     * @param {yak.WebSocketInstance} instance
     */
    this.onTerminate = function onTerminate(instance) {};
};
