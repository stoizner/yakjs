'use strict';

/* eslint-disable no-empty-function, no-unused-vars */

/**
 * @constructor
 * @struct
 * @see {!PluginWorker}
 * @param {!PluginContext} context
 */
function EchoPlugin(context) {
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
        context.log.debug('Register echo routes');

        // Create a route for http://localhost:<PORT>/echo
        event.app.get('/echo', (request, response) => {
            context.log.debug('/echo');
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
    createWorker: context => new EchoPlugin(context)
};
