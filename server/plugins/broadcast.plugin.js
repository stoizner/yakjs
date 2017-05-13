'use strict';

/* eslint-disable no-empty-function, no-unused-vars */

/**
 * Every received message will be sent to all clients that are connected to the instance.
 * Client A, B and C are connected to a WebSocket server instance with this plugin.
 * When A sends a message then it will be sent to B and C, but not back to A.
 * @constructor
 * @struct
 * @see {!PluginWorker}
 * @param {!PluginContext} context
 */
function BroadcastPlugin(context) {
    /**
     * @param {!WebSocketMessage} message
     * @param {!WebSocketConnection} myConnection
     */
    this.onMessage = (message, myConnection) => {
        let connections = context.instance.getConnections();

        connections.forEach(connection => {
            if (connection.id !== myConnection.id) {
                context.log.debug('Sending message to ' + connection.id);
                connection.send(message.data);
            }
        });
    };
}

module.exports = {
    name: 'broadcast',
    description: 'Every received message will be sent to all connected clients.',
    createWorker: context => new BroadcastPlugin(context)
};

