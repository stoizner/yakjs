/**
 * PingPongPluginWorker
 * @constructor
 * @implements {cobu.wsc.PluginWorker}
 */
cobu.wsc.PingPongPluginWorker = function PingPongPluginWorker() {

    'use strict';

    /** @type {cobu.wsc.PingPongPluginWorker} */
    var self = this;

    /** Constructor */
    function constructor() {
    }

    /**
     * @param {cobu.wsc.WebSocketConnection} connection
     */
    this.onNewConnection = function onNewConnection(connection) {};

    /**
     * @param {cobu.wsc.WebSocketMessage} message
     * @param {cobu.wsc.WebSocketConnection} connection
     * @param {cobu.wsc.WebSocketInstance} instance
     */
    this.onMessage = function onMessage(message, connection, instance) {
        if (message.data === 'ping') {
            connection.send('pong');
        }
    };

    constructor();
};
