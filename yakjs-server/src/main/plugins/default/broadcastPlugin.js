/**
 * BroadcastPlugin
 * Every received message will be send to all connected clients.
 * @constructor
 * @implements {yak.PluginWorker}
 */
yak.BroadcastPlugin = function BroadcastPlugin() {

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

        var connections = instance.getConnections();

        for(var i=0; i<connections.length; i++) {
            var conn = connections[i];

            if (conn.id !== connection.id) {
                conn.send(message.data);
            }
        }
    };

    /**
     * @param {yak.WebSocketInstance} instance
     */
    this.onTerminate = function onTerminate(instance) {};
};
