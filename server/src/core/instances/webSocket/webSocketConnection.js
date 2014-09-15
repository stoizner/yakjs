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
    this.id = null;

    /**
    * @type {WebSocket|null}
    */
    this.socket = socket || null;

    /** Constructor */
    function constructor() {
        //noinspection JSHint
        self.id = yak.guid();
    }

    /**
     * Send data on connection.
     * @param {string|object} data
     */
    this.send = function send(data) {
        log.debug('Sending message', {type: data.type});
        if (typeof data === 'object') {
            sendAsJson(data);
        } else {
            self.socket.send(data);
        }
    };

    /**
     * Send data on connection.
     * @param {object} obj
     */
    function sendAsJson(obj) {
        self.socket.send(JSON.stringify(obj));
    }

    constructor();
};
