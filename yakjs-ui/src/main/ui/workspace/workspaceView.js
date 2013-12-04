/**
 * WorkspaceView
 * @class
 * @constructor
 * @param {yak.ui.ViewContext} context
 * @param {$} parent
 */
yak.ui.WorkspaceView = function WorkspaceView(parent, context) {
    'use strict';

    /** @type {yak.ui.WorkspaceView} */
    var self = this;

    /**
     * @type {yak.ui.HeaderView}
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

        header = new yak.ui.HeaderView($('.header', parent), context);
        panelViews['panel-instance'] = new yak.ui.InstanceListView($('.panel-instance', parent), context);
        panelViews['panel-instance-edit'] = new yak.ui.InstanceView($('.panel-instance-edit', parent), context);
        panelViews['panel-plugin'] = new yak.ui.PluginListView($('.panel-plugin', parent), context);
        panelViews['panel-plugin-edit'] = new yak.ui.PluginView($('.panel-plugin-edit', parent), context);

        context.eventBus.on(yak.ui.ActivatePanelCommand).register(handleActivatePanel);
        context.eventBus.on(yak.ui.WebSocketOpenEvent).register(handleWebSocketOpen);
        context.eventBus.on(yak.ui.WebSocketCloseEvent).register(handleWebSocketClosed);

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
        notificationBar.html('Please connect to service port (default: 8790) of yakjs-server');
        notificationBar.show();
        $('.menu', parent).hide();
        $('.panels', parent).hide();
    }

    /**
     * @param {yak.ui.ActivatePanelCommand} command
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