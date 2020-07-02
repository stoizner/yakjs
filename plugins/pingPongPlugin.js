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
 * @param {YakPluginCommand} command
 */
function executeSendCommand(data, context, command) {
    let connections = context.instance.getConnections();

    context.log.debug('Execute command: ' + command.name);
    connections.forEach(connection => {
        context.log.debug(`Sending "${data} to ${connection.id}`);
        connection.send(data);
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
            execute: executeSendCommand,
            data: 'ping'
        },
        {
            name: 'sendPong',
            displayName: 'Send a pong',
            description: 'Send a pong message to all connected clients',
            execute: executeSendCommand,
            data: 'pong'
        }
    ]
};

