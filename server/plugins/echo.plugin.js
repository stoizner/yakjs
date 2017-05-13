'use strict';

/* eslint-disable no-empty-function, no-unused-vars */

/**
 * @constructor
 * @struct
 * @see {!PluginWorker}
 */
function EchoPlugin() {
    /**
     * @param {WebSocketMessage} message
     * @param {WebSocketConnection} connection
     */
    this.onMessage = (message, connection) => {
        connection.send(message.data);
    };
}

/**
 * @type {!Plugin}
 */
module.exports = {
    name: 'echo',
    description: 'Every received message will be send back',
    createWorker: () => new EchoPlugin()
};
