/**
 * WebSocketConnectCommand
 * @constructor
 * @param {string} webSocketUri
 */
yak.ui.WebSocketConnectCommand = function WebSocketConnectCommand(webSocketUri) {
    'use strict';
    this.type = 'yak.ui.WebSocketConnectCommand';

    /**
     * The websocket uri to connect.
     * @type {?string}
     */
    this.webSocketUri = webSocketUri || null;
};
