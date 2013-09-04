/**
 * ServiceMessageHandler
 * @interface
 */
cobu.wsc.ServiceMessageHandler = function ServiceMessageHandler() {

    'use strict';

    /**
    * @param {object} message
    * @param {cobu.wsc.WebSocketConnection} connection
    */
    this.handle = function handle(message, connection) {};
};