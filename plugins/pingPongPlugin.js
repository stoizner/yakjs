'use strict';

/* eslint-disable no-empty-function, no-unused-vars */

/**
 * For every received 'ping' string, this plugin will send an 'pong' string.
 * @constructor
 * @struct
 */
function PingPongPlugin() {
    /**
     * @param {WebSocketMessage} message
     * @param {WebSocketConnection} connection
     */
    this.onMessage = (message, connection) => {
        if (message.data === 'ping') {
            connection.send('pong');
        }
    };
}

/**
 * @param {?} data
 * @param {PluginContext} context
 * @param {CommandConfig} command
 */
function executeSendPingCommand(data, context, command) {
    let connections = context.instance.getConnections();

    context.log.debug('Execute command: ' + command.name);
    connections.forEach(connection => {
        context.log.debug('Sending ping to ' + connection.id);
        connection.send('ping');
    });

    return Promise.resolve();
}

module.exports = {
    name: 'pingPong',
    description: 'For every received "ping" string, this plugin will send an "pong" string.',
    createWorker: () => new PingPongPlugin(),
    commands: [
        {
            name: 'sendPing',
            displayName: 'Send a ping',
            description: 'Send a ping message to all connected clients',
            execute: executeSendPingCommand,
            exampleData: {}
        }
    ]
};

