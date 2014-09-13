/**
 * HeaderViewModel
 * @class
 * @constructor
 * @param {yak.ui.ViewModelContext} context
 */
yak.ui.HeaderViewModel = function HeaderViewModel(context) {
    'use strict';

    /**
     * @type {yak.ui.HeaderViewModel}
     */
    var self = this;

    /**
     * Local storage key, for storing the last used websocket uri.
     * @type {string}
     */
    var WEB_SOCKET_URI_STORAGE_KEY = 'yak-js-ui-user-data-web-socket-uri';

    /**
     * The default websocket uri used for the service port of the yak server.
     * @type {string}
     */
    var DEFAULT_WEBSOCKET_URI = 'ws://localhost:8791';

    /**
     * Is a websocket connection established?
     * @type {boolean}
     */
    this.isWebSocketConnected = false;

    /**
     * The websocket uri.
     * @type {?string}
     */
    this.webSocketUri = null;

    /**
     * Callback function for a changed web socket connection.
     * @type {Function}
     */
    this.onWebSocketConnectedChanged = yak.ui.noop();

    /**
     * Constructor
     */
    function constructor() {
        self.webSocketUri = getLastUsedWebSocketUri();

        context.eventBus.on(yak.ui.WebSocketOpenEvent).register(function() {
            console.log('on yak.ui.WebSocketOpenEvent');
            self.isWebSocketConnected = true;
            context.eventBus.post(new yak.ui.UpdateNotificationCommand(null));

            self.onWebSocketConnectedChanged();
        });

        context.eventBus.on(yak.ui.WebSocketCloseEvent).register(function() {
            console.log('on yak.ui.WebSocketCloseEvent');
            self.isWebSocketConnected = false;
            context.eventBus.post(new yak.ui.UpdateNotificationCommand('Please connect to service port of yakjs-server. The default port is 8791. For example: ws://localhost:8791'));

            self.onWebSocketConnectedChanged();
        });

        // Try an auto connect.
        self.connect(self.webSocketUri);
    }

    /**
     * Connect to websocket service port of the
     */
    this.connect = function connect(webSocketUri) {

        self.webSocketUri = webSocketUri;
        saveWebSocketUri();

        context.eventBus.post(new yak.ui.WebSocketConnectCommand(webSocketUri));
    };

    /**
     * Save websocket uri.
     */
    function saveWebSocketUri() {
        localStorage.setItem(WEB_SOCKET_URI_STORAGE_KEY, self.webSocketUri);
    }

    /**
     * @returns {string}
     */
    function getLastUsedWebSocketUri() {
        var webSocketUri = localStorage.getItem(WEB_SOCKET_URI_STORAGE_KEY);
        webSocketUri = webSocketUri || DEFAULT_WEBSOCKET_URI;

        return webSocketUri;
    }

    constructor();
};