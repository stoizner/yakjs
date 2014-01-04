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

    this.handleNewPluginClick = function() { viewModel.activatePluginEditPanel(); };
    this.handleRefreshClick = function() { viewModel.reloadAndRefreshList(); };
    this.activate = function() { viewModel.activate(); };

    /**
     * Constructor
     */
    function constructor() {
        console.log('yak.ui.PluginListView.constructor');
        parent.html(template.build());

        contextMenuActions.edit = handleContextMenuEdit;
        contextMenuActions.delete = viewModel.deletePlugin;

        viewModel.onItemsChanged = function() { self.createList(); };

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

        $('.plugin-item', itemContainer).contextMenu($('#plugin-item-context'), handleMenuClicked);
    };

    /**
     * @param event
     * @param context
     */
    function handleMenuClicked(context, event) {

        var pluginName = context.attr('data-plugin');
        var menuAction = $(event.target).attr('data-menu');

        if (contextMenuActions.hasOwnProperty(menuAction)) {
            contextMenuActions[menuAction](pluginName);
        } else {
            console.warn('No context menu handler found for ' + menuAction);
        }
    }

    /**
     * @param pluginName
     */
    function handleContextMenuEdit(pluginName) {
        var contextItem = _.findWhere(viewModel.items, { name: pluginName});
        viewModel.activatePluginEditPanel(contextItem);
    }

    constructor();
};