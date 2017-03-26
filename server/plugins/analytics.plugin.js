/**
 * @name analytics
 * @description Count received messages using the store
 * @version 0.1.0
 * @type WebSocketServerPlugin
 * @constructor
 * @implements
 * @param require
 */
function AnalyticsPlugin(require, context) {
    /**
     * @type {string}
     */
    var DATA_KEY = 'plugin.analytics.data';

    /**
     * @type {JsonStore}
     */
    var jsonStore = require('jsonStore');

    this.onStart = function onStart() {};

    /**
     * @param {WebSocketConnection} connection
     */
    this.onNewConnection = function onNewConnection(connection) {};

    /**
     * @param {WebSocketMessage} message
     * @param {WebSocketConnection} connection
     */
    this.onMessage = function onMessage(message, connection) {
        var analyticsData = jsonStore.getValue(DATA_KEY);
        var instanceName = context.instance.name;

        if (!analyticsData[instanceName]) {
            analyticsData[instanceName] = {
                messageCount: 0
            }
        }

        analyticsData[instanceName].messageCount = analyticsData[instanceName].messageCount + 1;

        jsonStore.setValue(DATA_KEY, analyticsData);
    };

    /**
     * Connection closed event. Note that the connection is no longer part of instance.getConnections().
     * @param {WebSocketConnection} connection
     */
    this.onConnectionClosed = function onConnectionClosed(connection) {};

    this.onStop = function onStop() {};
}


