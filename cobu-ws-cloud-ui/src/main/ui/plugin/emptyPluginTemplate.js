/**
 * EmptyPluginTemplate
 * @constructor
 */
cobu.wsc.ui.EmptyPluginTemplate = function Plugin() {

    'use strict';

    /**
     * @param {cobu.wsc.WebSocketInstance} instance
     */
    this.onInitialize = function onInit(instance) {};

    /**
     * @param {cobu.wsc.WebSocketConnection} connection
     */
    this.onNewConnection = function onNewConnection(connection) {};

    /**
     * @param {cobu.wsc.WebSocketMessage} message
     * @param {cobu.wsc.WebSocketConnection} connection
     * @param {cobu.wsc.WebSocketInstance} instance
     */
    this.onMessage = function onMessage(message, connection, instance) {};

    /**
     * @param {cobu.wsc.WebSocketInstance} instance
     */
    this.onTerminate = function onInit(instance) {};
};