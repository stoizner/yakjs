/**
 * PluginWorker
 * @interface
 */
yak.PluginWorker = function PluginWorker(name) {

    'use strict';

    /** @type {yak.PluginWorker} */
    var self = this;

    /**
     * Plugin name
     * @type {string}
     */
    this.name = name;

    /** Constructor */
    function constructor() {
    }

    /**
     * @param {yak.WebSocketInstance} instance
     */
    this.onInitialize = function onInit(instance) {};

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
    this.onMessage = function onMessage(message, connection, instance) {};

    /**
     * Connection closed event. Note that the connection is no longer part of instance.getConnections().
     * @param {yak.WebSocketConnection} connection
     * @param {yak.WebSocketInstance} instance
     */
    this.onConnectionClosed = function onConnectionClosed(connection, instance) {};

    /**
     * @param {yak.WebSocketInstance} instance
     */
    this.onTerminate = function onInit(instance) {};

    constructor();
};