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
    this.onActivePanelViewChanged = yak.ui.noop;

    /**
     *  Constructor
     */
    function constructor() {
        context.eventBus.on(yak.ui.ActivatePanelCommand).register(handleActivatePanel);
        self.activePanel = 'panel-instance';
        self.onActivePanelViewChanged();
    }

    /**
     * @param {yak.ui.ActivatePanelCommand} command
     */
    function handleActivatePanel(command) {
        console.log('handleActivatePanel', command);
        self.activePanel = command.panelName;
        self.activePanelData = command.data;
        self.onActivePanelViewChanged();
    }

    /**
     * @param {string} name The name of the panel.
     * @param {*} [data]
     */
    this.activatePanel = function activatePanel(name, data) {
        self.activePanel = name;
        self.activePanelData = data || null;
        self.onActivePanelViewChanged();
    };

    constructor();
};