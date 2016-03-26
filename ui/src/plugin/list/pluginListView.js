/**
 * PluginListView
 * @constructor
 * @param {jQuery} parent
 * @param {yak.ui.ViewContext} context
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

    /**
     * Activate the view.
     */
    this.activate = function activate() { viewModel.activate(); };

    /**
     * Constructor
     */
    function constructor() {
        console.log('yak.ui.PluginListView.constructor');
        parent.html(template.build());


        parent.find('[data-command=create]').click(viewModel.activatePluginEditPanel);
        parent.find('[data-command=refresh]').click(viewModel.reloadAndRefreshList);
        parent.find('.plugin-items').click(handleListClick);

        viewModel.onItemsChanged = function onItemsChanged() { createList(); };

        createList();
    }

    /**
     * @param {jQuery.Event} event
     */
    function handleListClick(event) {
        var listItem = $(event.target).closest('[data-id]');
        var pluginId = listItem.attr('data-id');

        if (pluginId) {
            viewModel.activatePluginEditPanel(pluginId);
        }
    }

    /**
     * Update panel list
     */
    function createList() {
        var html = '';
        var itemContainer = parent.find('.plugin-items');

        viewModel.items.sort(yak.ui.nameCompare);

        _.each(viewModel.items, function createListItem(item) {
            html += itemTemplate.build(item);
        });

        itemContainer.html(html);
    }

    constructor();
};
