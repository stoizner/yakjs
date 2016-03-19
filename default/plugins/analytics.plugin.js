/**
 * @name analytics
 * @description Count received messages using the store
 * @version 0.1.0
 * @constructor
 * @implements {yak.PluginWorker}
 * @param {yak.require} require
 */
function AnalyticsPlugin(require) {
    /**
     * @type {string}
     */
    var DATA_KEY = 'plugin.analytics.data';

    /**
     * @type {yak.JsonStore}
     */
    var jsonStore = require('jsonStore');

    /**
     * @param {yak.WebSocketInstance} instance
     */
    this.onInitialize = function onInitialize(instance) {};

    /**
     * @param {yak.WebSocketConnection} connection
     * @param {yak.WebSocketInstance} instance
     */
    this.onNewConnection = function onNewConnection(connection, instance) {};

    /**
     * @param {yak.WebSocketMessage} message
     * @param {yak.WebSocketConnection} connection
     * @param {yak.WebSocketInstance} instance
     */
    this.onMessage = function onMessage(message, connection, instance) {
        var analyticsData = jsonStore.getValue(DATA_KEY);

        if (!analyticsData[instance.name]) {
            analyticsData[instance.name] = {
                messageCount: 0
            }
        }

        analyticsData[instance.name].messageCount = analyticsData[instance.name].messageCount + 1;

        jsonStore.setValue(DATA_KEY, analyticsData);

    };

    /**
     * Connection closed event. Note that the connection is no longer part of instance.getConnections().
     * @param {yak.WebSocketConnection} connection
     * @param {yak.WebSocketInstance} instance
     */
    this.onConnectionClosed = function onConnectionClosed(connection, instance) {};

    /**
     * @param {yak.WebSocketInstance} instance
     */
    this.onTerminate = function onTerminate(instance) {};
}
