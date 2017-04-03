'use strict';

/* eslint-disable no-empty-function, no-unused-vars */

const eventBus = require('../modules/eventBus');
const guid = require('../common/guid');

/**
 * Every received message will be posted on the event bus.
 * Client A is connected to instance bridge A.
 * Client B is connected to instance bridge B.
   Client A sends a message. This message is posted on the event bus. Received by bridge B and sent to Client B.
 * @constructor
 * @struct
 */
function BridgePlugin(context) {
    let currentEventId = null;

    this.onStart = function onStart() {
        eventBus.subscribe(function onEventBusMessage(event) {
            if (event.eventId !== currentEventId) {
                context.log.info('Event received', {event: event, currentEventId: currentEventId});
                let connections = context.instance.getConnections();

                connections.forEach(connection => {
                    connection.send(event.data);
                });
            }
        });
    };

    /**
     * @param {WebSocketConnection} connection
     */
    this.onNewConnection = function onNewConnection(connection) {};

    /**
     * @param {WebSocketMessage} message
     * @param {WebSocketConnection} connection
     */
    this.onMessage = function onMessage(message, connection) {
        currentEventId = guid();

        let event = {
            eventId: currentEventId,
            data: message.data
        };

        context.log.info('Post event', {event: event});
        eventBus.post(event);
    };

    /**
     * Connection closed event. Note that the connection is no longer part of instance.getConnections().
     * @param {WebSocketConnection} connection
     */
    this.onConnectionClosed = function onConnectionClosed(connection) {};

    this.onStop = function onStop(instance) {};
}

module.exports = {
    name: 'bridge',
    description: 'Every received message will be posted on the event bus.',
    createWorker: context => new BridgePlugin(context)
};
