/**
 * EmptyPluginTemplate
 * @constructor
 */
yak.ui.EmptyPluginTemplate = function Plugin() {

    'use strict';

    /**
     * @param {yak.WebSocketInstance} instance
     */
    this.onInitialize = function onInitialize(instance) {};

    /**
     * @param {yak.WebSocketConnection} connection
     */
    this.onNewConnection = function onNewConnection(connection) {};

    /**
     * @param {yak.WebSocketMessage} message
     * @param {yak.WebSocketConnection} connection
     * @param {yak.WebSocketInstance} instance
     */
    this.onMessage = function onMessage(message, connection, instance) {};

    /**
     * @param {yak.WebSocketInstance} instance
     */
    this.onTerminate = function onTerminate(instance) {};
};