/**
 * WebSocketAdapter
 * @constructor
 * @param {cobu.EventBus} eventBus
 */
yak.ui.WebSocketAdapter = function WebSocketAdapter(eventBus) {
    'use strict';

    /**
     * @type {yak.ui.WebSocketAdapter}
     */
    var self = this;

    var websocket = null;

    this.onopen = null;
    this.onclose = null;
    this.onerror = null;

    /**
     * Response to request callback map.
     * @type {Object<string, function(yak.api.Response)>}
     */
    var requestResponseCallbackMap = {};

    /**
     * Constructor
     */
    function constructor() {
        eventBus.on(yak.ui.WebSocketConnectCommand).register(handleWebSocketConnectCommand);
    }

    /**
     * Connect to web socket server.
     * @param {string} uri The websocket URI.
     */
    this.connect = function connect(uri) {
        try {

            if (websocket) {
                websocket.close();
            }

            websocket = new WebSocket(uri);
            websocket.onopen = handleOpen;
            websocket.onclose = handleClose;
            websocket.onmessage = handleMessage;
            websocket.onerror = handleError;
        } catch(ex) {
            console.log(ex);
            websocket = null;

            if (self.onerror) {
                self.onerror();
            }
        }
    };

    /**
     * Send a request to the YAKjs server
     * @param {yak.api.Request} request
     * @param {Function} responseCallback Callback function for handling response message.
     */
    this.sendRequest = function sendRequest(request, responseCallback) {
        if (!request.id) {
            throw new Error('Can not send a request without an request id.');
        }
        requestResponseCallbackMap[request.id] = responseCallback;

        send(request);
    };

    /**
     * Deprecated send method.
     */
    this.send = function send() {
        throw new Error('Not supported any more. Please use sendRequest.');
    };

    /**
     *
     * @param {string|object} message
     */
    function send(message) {
        if (typeof message === 'object') {
            console.log('WebSocketAdapter.send', message);

            websocket.send(JSON.stringify(message));
        } else {
            websocket.send(message);
        }
    }

    /**
     * @param {yak.ui.WebSocketConnectCommand} command
     */
    function handleWebSocketConnectCommand(command) {
        self.connect(command.webSocketUri);
    }

    /**
     * @param {?} event
     */
    function handleOpen(event) {
        console.log('CONNECTED');

        if (self.onopen) {
            self.onopen();
        }

        eventBus.post(new yak.ui.WebSocketOpenEvent());
    }

    /**
     * @param {?} event
     */
    function handleClose(event) {
        console.log('DISCONNECTED');

        if (self.onclose) {
            self.onclose();
        }

        eventBus.post(new yak.ui.WebSocketCloseEvent());
    }

    /**
     * @param {?} event
     */
    function handleMessage(event) {
        var msg = null;

        try {
            msg = JSON.parse(event.data);
        } catch(ex) {
            console.log(ex);
        }

        if (msg) {
            if (isResponse(msg)) {
                var callback = requestResponseCallbackMap[msg.requestId];
                delete requestResponseCallbackMap[msg.requestId];

                if (callback) {
                    callback(msg);
                }
            } else {
                eventBus.post(msg);
            }
        }
    }

    /**
     * Check if a received websocket message is a response.
     * @param {Object} message
     * @returns {boolean} Whether received message is a response.
     */
    function isResponse(message) {
        return message.type && message.type.indexOf('response') === 0;
    }

    /**
     * @param {?} event
     */
    function handleError(event) {
        console.warn('yak.ui.WebSocketAdapter.handleError', {event: event});

        if (self.onerror) {
            self.onerror();
        }

        eventBus.post(new yak.ui.WebSocketErrorEvent());
    }

    constructor();
};
