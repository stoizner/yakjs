/**
 * @constructor
 * @struct
 * @param {jQuery} parent
 * @param {ViewContext} context
 * @param {PluginListViewModel} viewModel
 */
function PluginListView(parent, context, viewModel) {
    'use strict';

    /**
     * @type {!Template}
     */
    var template = context.template.load('pluginList');

    /**
     * @type {!Template}
     */
    var itemTemplate = context.template.load('pluginItem');

    this.activate = () => viewModel.activate();

    function constructor() {
        console.log('PluginListView.constructor');
        parent.html(template.build());

        parent.find('[data-element=create]').click(viewModel.activatePluginEditPanel);
        parent.find('[data-element=refresh]').click(viewModel.reload);
        parent.find('.plugin-items').click(handleListClick);

        viewModel.items.subscribeAndInvoke(createList);
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

    function createList() {
        var itemContainer = parent.find('.plugin-items');
        var rowElements = viewModel.items.value.map(itemTemplate.build);

        itemContainer.html(rowElements.join(''));
    }

    constructor();
}

module.exports = PluginListView;
