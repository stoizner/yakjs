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

module.exports = {
    name: 'pingPong',
    description: 'For every received "ping" string, this plugin will send an "pong" string.',
    createWorker: () => new PingPongPlugin()
};

