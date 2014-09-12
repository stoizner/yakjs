/**
 * WorkspaceView
 * @class
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
     * @type {Object.<string, object>}
     */
    var panelViews = {};

    /**
     * @type {yak.ui.Template}
     */
    var template = context.template.load('workspace');

    /**
     * Whether the main navigation is visible or not.
     * @type {*}
     */
    this.isNavigationVisible = context.ko.observable(false);

    /**
     *  Constructor
     */
    function constructor() {
        parent.html(template.build());

        context.viewFactory.create($('.header'), yak.ui.HeaderView, yak.ui.HeaderViewModel);
        context.viewFactory.create($('.notification', parent), yak.ui.NotificationView, yak.ui.NotificationViewModel);

        panelViews['panel-instance'] = context.viewFactory.create($('.panel-instance', parent), yak.ui.InstanceListView, yak.ui.InstanceListViewModel);
        panelViews['panel-instance-edit'] = context.viewFactory.create($('.panel-instance-edit', parent), yak.ui.InstanceView, yak.ui.InstanceViewModel);
        panelViews['panel-plugin'] = context.viewFactory.create($('.panel-plugin', parent), yak.ui.PluginListView, yak.ui.PluginListViewModel);
        panelViews['panel-plugin-edit'] = context.viewFactory.create($('.panel-plugin-edit', parent), yak.ui.PluginView, yak.ui.PluginViewModel);
        panelViews['panel-log'] = context.viewFactory.create($('.panel-log', parent), yak.ui.LogListView, yak.ui.LogListViewModel);
        panelViews['panel-store'] = context.viewFactory.create($('.panel-store', parent), yak.ui.StoreListView, yak.ui.StoreListViewModel);
        panelViews['panel-storeEntry-edit'] = context.viewFactory.create($('.panel-storeEntry-edit', parent), yak.ui.EditStoreEntryView, yak.ui.EditStoreEntryViewModel);
        viewModel.onActivePanelChanged = showPanel;
        showPanel();

        context.ko.applyBindings(self, $('.workspace-nav', parent)[0]);
    }

    /**
     * @param {yak.ui.WorkspaceViewModel} view
     * @param event
     */
    this.handleNavigationClick = function handleNavigationClick(view, event) {
        console.log('handleNavigationClick', view, event);

        var target = $(event.target).closest('li');
        var panelName = target.attr('data-panel');

        if (panelName) {
            $('.workspace-nav li', parent).removeClass('state-active');
            target.addClass('state-active');

            viewModel.activatePanel(panelName);
        }
    };

    /**
     * Show active panel.
     */
    function showPanel() {
        console.log('yak.ui.WorkspaceView.showPanel', { panel: viewModel.activePanel, data: viewModel.activePanelData });
        hidePanels();
        self.isNavigationVisible(false);

        if (viewModel.activePanel) {
            self.isNavigationVisible(true);

            $('.workspace-panels .' + viewModel.activePanel, parent).show();

            if (panelViews.hasOwnProperty(viewModel.activePanel)) {
                panelViews[viewModel.activePanel].activate(viewModel.activePanelData);
            } else {
                console.log('No view found.', { activePanel: viewModel.activePanel });
            }
        }
    }

    /**
     * Hide all panels.
     */
    function hidePanels() {
        $('.workspace-panels .panel', parent).hide();
    }

    constructor();
};