/**
 * BroadcastPluginWorker
 * @constructor
 * @implements {cobu.wsc.PluginWorker}
 */
cobu.wsc.BroadcastPluginWorker = function BroadcastPluginWorker() {

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

        var connections = instance.getConnections();

        for(var i=0; i<connections.length; i++) {
            var conn = connections[i];

            if (conn.id !== connection.id) {
                conn.send(message.data);
            }
        }
    };

    /**
     * @param {cobu.wsc.WebSocketInstance} instance
     */
    this.onTerminate = function onInit(instance) {};
};
