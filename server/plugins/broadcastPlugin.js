/**
 * @name BroadcastPlugin
 * @description Every received message will be sent to all connected clients.
 * @example
 *      Client A, B and C are connected to a WebSocket server instance with this plugin.
 *      When A sends a message then it will be sent to B and C, but not back to A.
 * @version 1.0.0
 * @type WebSocketServerPlugin
 * @constructor
 * @implements {yak.PluginWorker}
 * @param {yak.require} require
 */
function BroadcastPlugin(require) {
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
        // Get all connections to this instance.
        var connections = instance.getConnections();

        for(var i = 0; i < connections.length; i++) {
            var conn = connections[i];

            if (conn.id !== connection.id) {
                conn.send(message.data);
            }
        }
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
