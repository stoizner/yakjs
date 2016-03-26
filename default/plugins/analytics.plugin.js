/**
 * @name analytics
 * @description Count received messages using the store
 * @version 0.1.0
 * @constructor
 * @implements {yak.PluginWorker}
 * @param {yak.require} require
 * @param {yak.PluginContext} context
 */
function AnalyticsPlugin(require, context) {
    /**
     * @type {string}
     */
    var DATA_KEY = 'plugin.analytics.data';

    /**
     * @type {yak.JsonStore}
     */
    var jsonStore = require('jsonStore');

    this.onStart = function onStart() {};

    /**
     * @param {yak.WebSocketConnection} connection
     */
    this.onNewConnection = function onNewConnection(connection) {};

    /**
     * @param {yak.WebSocketMessage} message
     * @param {yak.WebSocketConnection} connection
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
     * @param {yak.WebSocketConnection} connection
     */
    this.onConnectionClosed = function onConnectionClosed(connection) {};

    this.onStop = function onStop() {};
}
