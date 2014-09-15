/**
 * WorkspaceViewModel
 * @constructor
 * @param {yak.ui.ViewModelContext} context
 */
yak.ui.WorkspaceViewModel = function WorkspaceViewModel(context) {
    'use strict';

    /** @type {yak.ui.WorkspaceViewModel} */
    var self = this;

    /**
     * The current active panel.
     * @type {?string}
     */
    this.activePanel = null;

    /**
     * Data for the active panel.
     * @type {*}
     */
    this.activePanelData = null;

    /**
     * Callback function for active panel changed event.
     * @type {Function}
     */
    this.onActivePanelChanged = yak.ui.noop;

    /**
     *  Constructor
     */
    function constructor() {
        context.eventBus.on(yak.ui.ActivatePanelCommand).register(handleActivatePanel);
        context.eventBus.on(yak.ui.WebSocketOpenEvent).register(handleWebSocketOpen);
        context.eventBus.on(yak.ui.WebSocketCloseEvent).register(handleWebSocketClosed);
    }

    /**
     * @param {yak.ui.ActivatePanelCommand} command
     */
    function handleActivatePanel(command) {
        console.log('handleActivatePanel', command);
        self.activePanel = command.panelName;
        self.activePanelData = command.data;
        self.onActivePanelChanged();
    }

    /**
     * Handle event when web socket was opened.
     */
    function handleWebSocketOpen() {
        self.activePanel = 'panel-instance';
        self.onActivePanelChanged();
    }

    /**
     * Handle event when web socket was closed.
     */
    function handleWebSocketClosed() {
        self.activePanel = null;
        self.onActivePanelChanged();
    }

    /**
     * @param {string} name The name of the panel.
     * @param {*} [data]
     */
    this.activatePanel = function activatePanel(name, data) {
        self.activePanel = name;
        self.activePanelData = data || null;
        self.onActivePanelChanged();
    };

    constructor();
};