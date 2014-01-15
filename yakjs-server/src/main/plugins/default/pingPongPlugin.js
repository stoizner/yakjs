/**
 * PingPong
 * For every received 'ping' string, this plugin will send an 'pong' string.
 * @constructor
 * @implements {yak.PluginWorker}
 */
yak.PingPongPlugin = function PingPongPlugin() {

    'use strict';

    /**
     * @param {yak.WebSocketInstance} instance
     */
    this.onInitialize = function onInitialize(instance) {};

    /**
     * @param {yak.WebSocketConnection} connection
     */
    this.onNewConnection = function onNewConnection(connection) {};

    /**
     * @param {yak.WebSocketMessage} message
     * @param {yak.WebSocketConnection} connection
     * @param {yak.WebSocketInstance} instance
     */
    this.onMessage = function onMessage(message, connection, instance) {
        if (message.data === 'ping') {
            connection.send('pong');
        }
    };

    /**
     * @param {yak.WebSocketInstance} instance
     */
    this.onTerminate = function onTerminate(instance) {};
};
