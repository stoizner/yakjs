/**
 * @constructor
 * @param {jQuery} parent
 * @param {ViewContext} context
 * @param {CommandListViewModel} viewModel
 */
function CommandListView(parent, context, viewModel) {
    'use strict';

    /**
     * @type {Template}
     */
    var template = context.template.load('CommandList');

    /**
     * @type {Template}
     */
    var itemTemplate = context.template.load('commandListItem');

    /**
     * @type {Template}
     */
    var groupTemplate = context.template.load('commandGroupItem');

    /**
     * Activate the view.
     */
    this.activate = viewModel.activate;

    /**
     * @type {jquery}
     */
    var itemList;

    var groupsList;

    function constructor() {
        console.log('CommandListView.constructor');
        parent.html(template.build());

        parent.find('[data-element=refresh]').click(viewModel.reload);
        parent.find('[data-element=clearFilter]').click(viewModel.clearFilter);
        parent.find('[data-element=commandsFilter]').click(viewModel.activateCommandFilter);
        parent.find('[data-element=presetsFilter]').click(viewModel.activatePresetFilter);

        itemList = parent.find('[data-element=commandList]');
        itemList.click(handleListClick);

        groupsList = parent.find('[data-element=groups]');
        groupsList.click(handleGroupListClick);

        viewModel.onItemsChanged = updateList;

        updateList();
    }

    /**
     * @param {jQuery.Event} event
     */
    function handleListClick(event) {
        var clickTarget = $(event.target);
        var listItemElement = clickTarget.closest('[data-id]');
        var commandId = listItemElement.attr('data-id');

        if (commandId) {
            if (clickTarget.attr('data-element') === 'runButton') {
                viewModel.runCommand(commandId);
            } else {
                viewModel.openCommandDetailPanel(commandId);
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

    function updateList() {
        itemList.html(viewModel.items.map(itemTemplate.build).join(''));

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
