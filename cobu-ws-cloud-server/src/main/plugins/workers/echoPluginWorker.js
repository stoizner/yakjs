/**
 * EchoPluginWorker
 * @constructor
 * @implements {cobu.wsc.PluginWorker}
 */
cobu.wsc.EchoPluginWorker = function EchoPluginWorker() {

    'use strict';

    /**
     * @param {cobu.wsc.WebSocketInstance} instance
     */
    this.onInitialize = function onInit(instance) {};

    /**
     * @param {cobu.wsc.WebSocketConnection} connection
     */
    this.onNewConnection = function onNewConnection(connection) {};

    /**
     * @param {cobu.wsc.WebSocketMessage} message
     * @param {cobu.wsc.WebSocketConnection} connection
     * @param {cobu.wsc.WebSocketInstance} instance
     */
    this.onMessage = function onMessage(message, connection, instance) {
        connection.send(message.data);
    };

    /**
     * @param {cobu.wsc.WebSocketInstance} instance
     */
    this.onTerminate = function onInit(instance) {};
};
