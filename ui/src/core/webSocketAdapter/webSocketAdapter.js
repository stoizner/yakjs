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
     *
     * @param {string|object} message
     * @param {object} [options] Optional options.
     */
    this.send = function send(message, options) {
        if (typeof message === 'object') {
            if (options) {
                message =  _.extend(message, _.pick(options, _.keys(message)));
            }

            console.log('WebSocketAdapter.send', message);

            websocket.send(JSON.stringify(message));
        } else {
            websocket.send(message);
        }
    };

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
            eventBus.post(msg);
        }
    }

    /**
     * @param {?} event
     */
    function handleError(event) {

        console.log(event);

        if (self.onerror) {
            self.onerror();
        }

        eventBus.post(new yak.ui.WebSocketErrorEvent());
    }

    constructor();
};
