/**
 * ModuleListView
 * @constructor
 * @param {jQuery} parent
 * @param {ViewContext} context
 * @param {ModuleListViewModel} viewModel
 */
function ModuleListView(parent, context, viewModel) {
    'use strict';

    /**
     * @type {Template}
     */
    var template = context.template.load('moduleList');

    /**
     * @type {Template}
     */
    var itemTemplate = context.template.load('moduleListItem');

    /**
     * Activate the view.
     */
    this.activate = function activate() { viewModel.activate(); };

    /**
     * Constructor
     */
    function constructor() {
        console.log('ModuleListView.constructor');
        parent.html(template.build());

        parent.find('[data-command=refresh]').click(viewModel.reload);
        parent.find('[data-command=clearModuleCache]').click(viewModel.clearModuleCache);
        parent.find('.module-items').click(handleListClick);

        viewModel.onItemsChanged = function onItemsChanged() { createList(); };

        createList();
    }

    /**
     * @param {jQuery.Event} event
     */
    function handleListClick(event) {
        var listItem = $(event.target).closest('[data-id]');
        var moduleId = listItem.attr('data-id');

        if (moduleId) {
            viewModel.activateModuleDetailPanel(moduleId);
        }
    }

    /**
     * Update panel list
     */
    function createList() {
        var itemContainer = parent.find('.module-items');

        var html = viewModel.items.map(function createListItem(item) {
            return itemTemplate.build(item);
        }).join('');

        itemContainer.html(html);
    }

    constructor();
}

module.exports = ModuleListView;
