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
        const connections = context.instance.getConnections();

        connections.forEach(connection => {
            if (connection.id !== myConnection.id) {
                context.log.debug('Sending message to ' + connection.id);
                connection.send(message.data);
            }
        });
    };
}

/**
 * @param {?} data
 * @param {PluginContext} context
 * @param {CommandConfig} command
 */
function executeBroadcastCommand(data, context, command) {
    const connections = context.instance.getConnections();

    context.log.debug('Execute command: ' + command.name);
    connections.forEach(connection => {
        context.log.debug('Sending message to ' + connection.id);
        connection.send(data);
    });

    return Promise.resolve({
        message: `Data was send on instance "${context.instance.name}" to ${connections.length} connections`,
        instanceName: context.instance.name,
        connectionCount: connections.length
    });
}

module.exports = {
    name: 'broadcast',
    description: 'Every received message will be sent to all connected clients.',
    createWorker: context => new BroadcastPlugin(context),
    commands: [
        {
            name: 'broadcast',
            displayName: 'Broadcast',
            description: 'Send a message to all connected clients',
            execute: executeBroadcastCommand,
            data: {
                message: 'Hello World'
            }
        }
    ]
};

