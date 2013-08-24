/**
 * HeaderView
 * @class
 * @constructor
 * @param {$} parent
 * @param {cobu.wsc.ui.ViewContext} context
 */
cobu.wsc.ui.HeaderView = function HeaderView(parent, context)
{
   'use strict';

   /** @type {cobu.wsc.ui.HeaderView} */
   var self = this;

   var WEB_SOCKET_URI_STORAGE_KEY = 'cobu-wsc-ui-user-data-web-socket-uri';

   var uriInput = null;

   /** Constructor */
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
    *
    */
   function handleSocketOpen() {
      uriInput.removeClass('state-error');
      uriInput.addClass('state-connected');
   }

   /**
    *
    */
   function handleSocketClose() {
      uriInput.removeClass('state-connected');
      uriInput.removeClass('state-error');
   }

   /**
    *
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
    * handleUriFocusOut
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