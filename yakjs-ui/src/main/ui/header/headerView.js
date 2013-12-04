/**
 * HeaderView
 * @class
 * @constructor
 * @param {$} parent
 * @param {yak.ui.ViewContext} context
 */
yak.ui.HeaderView = function HeaderView(parent, context) {
    'use strict';

    /** @type {yak.ui.HeaderView} */
    var self = this;

    var WEB_SOCKET_URI_STORAGE_KEY = 'yak-js-ui-user-data-web-socket-uri';

    var uriInput = null;

    /**
     * Constructor
     */
    function constructor() {

        uriInput = $('#webSocketUri', parent);
        uriInput.val(getLastUsedWebSocketUri());
        uriInput.focusout(handleUriFocusOut);

        $('#webSocketConnect').click(handleConnectClick);

        context.webSocket.onclose = handleSocketClose;
        context.webSocket.onopen = handleSocketOpen;
        context.webSocket.onerror = handleSocketError;
        context.webSocket.connect(uriInput.val());
    }

    /**
     * Handle websocket open event.
     */
    function handleSocketOpen() {
        uriInput.removeClass('state-error');
        uriInput.addClass('state-connected');
    }

    /**
     * Handle websocket close event.
     */
    function handleSocketClose() {
        uriInput.removeClass('state-connected');
        uriInput.removeClass('state-error');
    }

    /**
     * Handle websocket error event.
     */
    function handleSocketError() {
        uriInput.removeClass('state-connected');
        uriInput.addClass('state-error');
    }

    /**
     * Handle connect button click.
     */
    function handleConnectClick() {
        saveWebSocketUri();
        context.webSocket.connect($('#webSocketUri').val());
    }

    /**
     * handle Uri FocusOut
     */
    function handleUriFocusOut() {
        saveWebSocketUri();
    }

    /**
    * Save websocket uri.
    */
    function saveWebSocketUri() {
        localStorage.setItem(WEB_SOCKET_URI_STORAGE_KEY, $('#webSocketUri').val());
    }

    /**
     * @returns {string}
     */
    function getLastUsedWebSocketUri() {
        var webSocketUri = localStorage.getItem(WEB_SOCKET_URI_STORAGE_KEY);
        webSocketUri = webSocketUri || 'ws://localhost:8080';

        return webSocketUri;
    }

    constructor();
};