/**
 * WorkspaceView
 * @class
 * @constructor
 * @param {cobu.wsc.ui.ViewContext} context
 * @param {$} parent
 */
cobu.wsc.ui.WorkspaceView = function WorkspaceView(parent, context)
{
   'use strict';

    /** @type {cobu.wsc.ui.WorkspaceView} */
    var self = this;

    /**
     * @type {$|jQuery}
     */
    var header = null;

    /**
     * @type {$|jQuery}
     */
    var instanceList = null;

    /**
     * @type {Object.<string, object>}
     */
    var panelViews = {};

    /**
     *  Constructor
     */
    function constructor() {

        header = new cobu.wsc.ui.HeaderView($('.header', parent), context);
        panelViews['panel-instance'] = new cobu.wsc.ui.InstanceListView($('.panel-instance', parent), context);
        panelViews['panel-instance-edit'] = new cobu.wsc.ui.InstanceView($('.panel-instance-edit', parent), context);
        panelViews['panel-plugin'] = new cobu.wsc.ui.PluginListView($('.panel-plugin', parent), context);
        panelViews['panel-plugin-edit'] = new cobu.wsc.ui.PluginView($('.panel-plugin-edit', parent), context);

        context.eventBus.on(cobu.wsc.ui.ActivatePanelCommand).register(handleActivatePanel);
        context.eventBus.on(cobu.wsc.ui.WebSocketOpenEvent).register(handleWebSocketOpen);
        context.eventBus.on(cobu.wsc.ui.WebSocketCloseEvent).register(handleWebSocketClosed);

        $('.menu li', parent).click(handleMenuItemClick);
        hidePanels();
        showPleaseConnectNotification();
    }

    /**
     * Handle event when web socket was opened.
     */
    function handleWebSocketOpen() {
        console.log('handleWebSocketOpen');
        $('.notification', parent).hide();

        $('.menu', parent).show();
        $('.panels', parent).show();

        activatePanel('panel-instance', null);
    }

    /**
     * Handle event when web socket was closed.
     */
    function handleWebSocketClosed() {
        console.log('handleWebSocketClosed');
        showPleaseConnectNotification();
    }

    /**
     * Show 'Please connect to service port' notification
     */
    function showPleaseConnectNotification() {
        var notificationBar = $('.notification', parent);
        notificationBar.html('Please connect to service port (default: 8791) of cobu-ws-cloud.');
        notificationBar.show();
        $('.menu', parent).hide();
        $('.panels', parent).hide();
    }

    /**
     * @param {cobu.wsc.ui.ActivatePanelCommand} command
     */
    function handleActivatePanel(command) {
        console.log('handleActivatePanel', command);
        activatePanel(command.panelName, command.data);
    }

   /**
    *
    * @param event
    */
   function handleMenuItemClick(event) {
      var target = $(event.currentTarget);
      var panelName = target.attr('data-panel');

      $('.menu li', parent).removeClass('state-active');
      target.addClass('state-active');

      activatePanel(panelName);
   }

   /**
    *
    * @param {string} name
    * @param {null|string|object} data
    */
   function activatePanel(name, data) {
      console.log('activatePanel', name, data);
      hidePanels();
      $('.panels .' + name, parent).show();

      if (panelViews.hasOwnProperty(name)) {
         panelViews[name].active(data);
      }
   }

   /**
    * Hide all panels.
    */
   function hidePanels() {
      $('.panels .panel', parent).hide();
   }

   constructor();
};