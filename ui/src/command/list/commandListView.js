/**
 * @constructor
 * @param {jQuery} parent
 * @param {ViewContext} context
 * @param {CommandListViewModel} viewModel
 */
function CommandListView(parent, context, viewModel) {
    'use strict';

    /**
     * @type {!Template}
     */
    var template = context.template.load('CommandList');

    /**
     * @type {!Template}
     */
    var itemTemplate = context.template.load('commandListItem');

    /**
     * @type {!Template}
     */
    var groupTemplate = context.template.load('commandGroupItem');

    this.activate = viewModel.activate;

    /**
     * @type {jQuery}
     */
    var itemList;

    /**
     * @type {jQuery}
     */
    var groupsList;

    function constructor() {
        console.log('CommandListView.constructor');
        parent.html(template.build());

        parent.find('[data-element=create]').click(() => viewModel.openCommandDetailPanel());
        parent.find('[data-element=clearFilter]').click(viewModel.clearFilter);
        parent.find('[data-element=refresh]').click(viewModel.reload);

        itemList = parent.find('[data-element=commandPresetList]');
        itemList.click(handleListClick);

        groupsList = parent.find('[data-element=groups]');
        groupsList.click(handleGroupListClick);

        viewModel.items.subscribeAndInvoke(updateList);
    }

    /**
     * @param {jQuery.Event} event
     */
    function handleListClick(event) {
        var clickTarget = $(event.target);
        var listItemElement = clickTarget.closest('[data-id]');
        var itemId = listItemElement.attr('data-id');

        if (itemId) {
            if (clickTarget.attr('data-element') === 'runButton') {
                viewModel.runCommandPreset(itemId);
            } else {
                viewModel.openCommandDetailPanel(itemId);
            }
        }
    }

    /**
     * @param {jQuery.Event} event
     */
    function handleGroupListClick(event) {
        var clickTarget = $(event.target);
        var groupItemElement = clickTarget.closest('[data-id]');
        var groupName = groupItemElement.attr('data-id');

        viewModel.activateGroupFilter(groupName);
    }

    /**
     * @param {!Array<!CommandListItem>} items
     */
    function updateList(items) {
        itemList.html(items.map(itemTemplate.build).join(''));

        if (viewModel.groups) {
            parent.find('[data-element=groups]').html(groupTemplate.build({groups: viewModel.groups}));
            parent.find('[data-element=groups]').show();
        } else {
            parent.find('[data-element=groups]').hide();
        }
    }

    constructor();
}

module.exports = CommandListView;
