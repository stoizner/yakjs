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

    /**
     * @param {!InstanceStartedEvent} event
     */
    this.onInstanceStarted = event => {
        // Create a route for http://localhost:<PORT>/echo
        event.app.get('/echo', (request, response) => {
            response.send('Hello from the echo plugin!');
        });
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
