'use strict';

const createGuid = require('../../common/guid');
const Logger = require('../infrastructure/logger');

/**
 * @constructor
 * @struct
 * @param {WebSocket} socket
 */
function WebSocketConnection(socket) {
    /**
     * @type {!Logger}
     */
    const log = new Logger('WebSocketConnection');

    /**
     * Unique Id of the web socket connection.
     * @type {string}
     */
    this.id = createGuid();

    /**
     * Sends data over the WebSocket connection.
     * @param {string|object} data
     */
    this.send = function send(data) {
        log.debug('Sending message', {type: data.type, data: data});

        let isObject = typeof data === 'object';
        let message = isObject ? JSON.stringify(data) : data;

        sendMessage(message);
    };

    /**
     * Sends a message over the WebSocket connection.
     * @param {string} message
     */
    function sendMessage(message) {
        if (socket && socket.readyState === socket.OPEN) {
            try {
                socket.send(message);
            } catch (ex) {
                log.warn('Could not send message.', {error: ex.message});
            }
        } else {
            log.info('Could not send message, the WebSocket connection is no longer open.');
        }
    }
}

module.exports = WebSocketConnection;
