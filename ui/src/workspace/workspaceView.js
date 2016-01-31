/**
 * WorkspaceView
 * @constructor
 * @param {yak.ui.ViewContext} context
 * @param {jQuery} parent
 * @param {yak.ui.WorkspaceViewModel} viewModel
 */
yak.ui.WorkspaceView = function WorkspaceView(parent, context, viewModel) {
    'use strict';

    /**
     * @type {yak.ui.WorkspaceView}
     */
    var self = this;

    /**
     * @type {Object<string, object>}
     */
    var panels = {};

    /**
     * @type {yak.ui.Template}
     */
    var template = context.template.load('workspace');

    /**
     * @type {yak.ui.TabPanel}
     */
    var tabPanel = null;

    /**
     *  Constructor
     */
    function constructor() {
        parent.html(template.build());

        context.viewFactory.create($('.app-bar'), yak.ui.AppBarView, yak.ui.AppBarViewModel);
        context.viewFactory.create($('.notification', parent), yak.ui.NotificationView, yak.ui.NotificationViewModel);
        context.viewFactory.create($('[data-view=fileUploadView]', parent), yak.ui.FileUploadView, yak.ui.FileUploadViewModel);

        panels['panel-instance'] = context.viewFactory.create($('.panel[data-panel=panel-instance]', parent), yak.ui.InstanceListView, yak.ui.InstanceListViewModel);
        panels['panel-instance-edit'] = context.viewFactory.create($('.panel[data-panel=panel-instance-edit]', parent), yak.ui.InstanceView, yak.ui.InstanceViewModel);

        panels['panel-plugin'] = context.viewFactory.create($('.panel[data-panel=panel-plugin]', parent), yak.ui.PluginListView, yak.ui.PluginListViewModel);
        panels['panel-plugin-edit'] = context.viewFactory.create($('.panel[data-panel=panel-plugin-edit]', parent), yak.ui.PluginView, yak.ui.PluginViewModel);
        panels['panel-store'] = context.viewFactory.create($('.panel[data-panel=panel-store]', parent), yak.ui.StoreListView, yak.ui.StoreListViewModel);
        panels['panel-storeEntry-edit'] = context.viewFactory.create($('.panel[data-panel=panel-storeEntry-edit]', parent), yak.ui.EditStoreEntryView, yak.ui.EditStoreEntryViewModel);

        tabPanel = new yak.ui.TabPanel(parent);
        tabPanel.onTabChanged = handleTabChanged;

        viewModel.onActivePanelViewChanged = switchToPanel;
        switchToPanel();
    }

    /**
     * Switch to active panel.
     */
    function switchToPanel() {
        tabPanel.switchTo(viewModel.activePanel);
    }

    /**
     * Activate view when panel is changed.
     * @param {string} panelId
     */
    function handleTabChanged(panelId) {
        if (panels.hasOwnProperty(viewModel.activePanel)) {
            panels[panelId].activate(viewModel.activePanelData);
            viewModel.activePanel = panelId;
        } else {
            console.log('No view found.', { activePanel: viewModel.activePanel });
        }
    }

    constructor();
};
