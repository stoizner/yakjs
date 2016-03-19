/**
 * @interface
 * @param {string} name The name of the plugin.
 */
yak.PluginWorker = function PluginWorker(name) {
    /**
     * Plugin name
     * @type {string}
     */
    this.name = name;

    /**
     * Called when the instance is started.
     */
    this.onInitialize = function onInitialize() {};

    /**
     * Called on new client connected to instance.
     * @param {yak.WebSocketConnection} connection
     */
    this.onNewConnection = function onNewConnection(connection) {};

    /**
     * Called for every received websocket message.
     * @param {yak.WebSocketMessage} message
     * @param {yak.WebSocketConnection} connection
     */
    this.onMessage = function onMessage(message, connection) {};

    /**
     * Connection closed event. Note that the connection is no longer part of instance.getConnections().
     * @param {yak.WebSocketConnection} connection
     */
    this.onConnectionClosed = function onConnectionClosed(connection) {};

    /**
     * Called when the instance is stopped.
     */
    this.onTerminate = function onTerminate() {};
};
