/**
 * WebSocketConnection
 * @constructor
 * @param {WebSocket} [socket]
 */
yak.WebSocketConnection = function WebSocketConnection(socket) {
    /**
     * @type {yak.WebSocketConnection}
     */
    var self = this;

    /**
     * @type {yak.Logger}
     */
    var log = new yak.Logger(self.constructor.name);

    /**
     * Unique Id of the web socket connection.
     * @type {string}
     */
    this.id = yak.guid();

    /**
     * @type {WebSocket|null}
     */
    this.socket = socket || null;

    /**
     * Sends data over the WebSocket connection.
     * @param {string|object} data
     */
    this.send = function send(data) {
        log.debug('Sending message', {type: data.type, data: data});

        var isObject = typeof data === 'object';
        var message = isObject ? JSON.stringify(data) : data;

        sendMessage(message);
    };

    /**
     * Sends a message over the WebSocket connection.
     * @param {string} message
     */
    function sendMessage(message) {
        if (self.socket && self.socket.readyState === self.socket.OPEN) {
            try {
                self.socket.send(message);
            } catch (ex) {
                log.warn('Could not send message.', {error: ex.message});
            }
        } else {
            log.info('Could not send message, the WebSocket connection is no longer open.');
        }
    }
};
