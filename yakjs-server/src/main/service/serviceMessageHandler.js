/**
 * ServiceMessageHandler
 * @interface
 */
yak.ServiceMessageHandler = function ServiceMessageHandler() {

    'use strict';

    /**
    * @param {object} message
    * @param {yak.WebSocketConnection} connection
    */
    this.handle = function handle(message, connection) {};
};