'use strict';

/* eslint-disable no-empty-function, no-unused-vars */

/**
 * @constructor
 * @struct
 * @param {!PluginContext} context
 */
function EmptyPlugin(context) {
    this.onStart = () => {};

    /**
     * @param {!InstanceStartedEvent} event
     */
    this.onInstanceStarted = event => {};

    /**
     * @param {!WebSocketConnection} connection
     */
    this.onNewConnection = connection => {};

    /**
     * @param {!WebSocketMessage} message
     * @param {!WebSocketConnection} connection
     */
    this.onMessage = (message, connection) => {};

    /**
     * @param {!WebSocketConnection} connection
     */
    this.onConnectionClosed = connection => {};

    this.onStop = () => {};
}

export default {
    name: 'empty',
    description: 'This plugin does nothing.',
    createWorker: context => new EmptyPlugin(context)
};

