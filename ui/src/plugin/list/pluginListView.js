/**
 * PluginListView
 * @constructor
 * @param {yak.ui.ViewContext} context
 * @param {jQuery} parent
 * @param {yak.ui.PluginListViewModel} viewModel
 */
yak.ui.PluginListView = function PluginListView(parent, context, viewModel) {
    'use strict';

    /**
     * @type {yak.ui.PluginListView}
     */
    var self = this;

    /**
     * @type {yak.ui.Template}
     */
    var template = context.template.load('panelPlugins');

    /**
     * @type {yak.ui.Template}
     */
    var itemTemplate = context.template.load('pluginItem');

    var contextMenuActions = {};

    this.handleNewPluginClick = function handleNewPluginClick() { viewModel.activatePluginEditPanel(); };
    this.handleRefreshClick = function handleRefreshClick() { viewModel.reloadAndRefreshList(); };
    this.activate = function activate() { viewModel.activate(); };

    /**
     * Constructor
     */
    function constructor() {
        console.log('yak.ui.PluginListView.constructor');
        parent.html(template.build());

        contextMenuActions.edit = handleContextMenuEdit;
        contextMenuActions.delete = viewModel.deletePlugin;

        viewModel.onItemsChanged = function onItemsChanged() { self.createList(); };

        context.ko.applyBindings(self, parent[0]);
        self.createList();
    }

    /**
     * Update panel list
     */
    this.createList = function createList() {

        var html = '';
        var itemContainer = $('.plugin-items', parent);

        viewModel.items.sort(yak.ui.nameCompare);

        _.each(viewModel.items, function(item) {
            html += itemTemplate.build(item);
        });

        itemContainer.html(html);

        $('.list-item-open-context', itemContainer).contextMenu($('#plugin-item-context'), handleMenuClicked);
    };

    /**
     * @param {jQuery} context
     * @param event
     */
    function handleMenuClicked(context, event) {

        var pluginName = context.closest('.list-item').attr('data-plugin');
        var menuAction = $(event.target).attr('data-menu');

        if (contextMenuActions.hasOwnProperty(menuAction)) {
            contextMenuActions[menuAction](pluginName);
        } else {
            console.warn('No context menu handler found for ' + menuAction);
        }
    }

    /**
     * @param {string} pluginName
     */
    function handleContextMenuEdit(pluginName) {
        var contextItem = _.findWhere(viewModel.items, { name: pluginName});
        viewModel.activatePluginEditPanel(contextItem);
    }

    /**
     * Show and activate the plugin edit panel.
     * @param {yak.ui.PluginItem} [item]
     */
    this.activatePluginEditPanel = function activatePluginEditPanel(item) {
        context.eventBus.post(new yak.ui.ActivatePanelCommand('panel-plugin-edit', item));
    };

    constructor();
};