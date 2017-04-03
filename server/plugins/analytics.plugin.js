'use strict';

/* eslint-disable no-empty-function, no-unused-vars */

/**
 * @type {!JsonStore}
 */
const jsonStore = require('../common/jsonStore');

/**
 * @constructor
 * @struct
 */
function AnalyticsPlugin(context) {
    /**
     * @type {string}
     */
    const DATA_KEY = 'plugin.analytics.data';

    this.onStart = () => {};

    /**
     * @param {!WebSocketConnection} connection
     */
    this.onNewConnection = connection => {};

    /**
     * @param {!WebSocketMessage} message
     * @param {!WebSocketConnection} connection
     */
    this.onMessage = (message, connection) => {
        let analyticsData = jsonStore.getValue(DATA_KEY);
        let instanceName = context.instance.name;

        if (!analyticsData[instanceName]) {
            analyticsData[instanceName] = {
                messageCount: 0
            };
        }

        analyticsData[instanceName].messageCount += 1;

        jsonStore.setValue(DATA_KEY, analyticsData);
    };

    /**
     * Connection closed event. Note that the connection is no longer part of instance.getConnections().
     * @param {!WebSocketConnection} connection
     */
    this.onConnectionClosed = connection => {};

    this.onStop = () => {};
}

module.exports = {
    name: 'analytics',
    description: 'Count received messages per instance and saves it to the store.',
    createWorker: context => new AnalyticsPlugin(context)
};

