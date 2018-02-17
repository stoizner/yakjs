/**
 * @constructor
 * @struct
 * @param {jQuery} parent
 * @param {ViewContext} context
 * @param {InstanceListViewModel} viewModel
 */
function InstanceListView(parent, context, viewModel) {
    'use strict';

    /**
     * @type {Template}
     */
    var template = context.template.load('instanceList');

    /**
     * Activate view.
     */
    this.activate = viewModel.activate;

    /**
     * @type {jquery}
     */
    var itemList;

    function constructor() {
        viewModel.onItemsChanged = createList;
    }

    /**
     * Create the instance list.
     */
    function createList() {
        parent.empty();
        parent.html(template.build({instances: viewModel.items}));

        itemList = parent.find('[data-element=instanceList]');
        itemList.on('click', handleListClick);

        parent.find('[data-element=create]').click(function() { viewModel.activateInstanceEditPanel(); });
        parent.find('[data-element=restart]').click(function() { viewModel.restartAllInstances(); });
        parent.find('[data-element=refresh]').click(viewModel.reload);
    }

    /**
     * @param {jQuery.Event} event
     */
    function handleListClick(event) {
        var clickTarget = $(event.target);
        var listItemElement = clickTarget.closest('[data-id]');
        var instanceId = listItemElement.attr('data-id');
        var outerStartStopButton = clickTarget.closest('[data-element=startStopButton]');
        var innerStartStopButton = clickTarget.find('[data-element=startStopButton]');

        var startStopButton = $(outerStartStopButton[0] || innerStartStopButton[0]);

        if (startStopButton.length > 0) {
            var isActive = startStopButton.attr('data-is-active') === 'true';
            console.log('Start/Stop button clicked', {isChecked: isActive});
            if (isActive) {
                startStopButton.attr('data-is-active', 'false');
                viewModel.stopInstance(instanceId);
            } else {
                startStopButton.attr('data-is-active', 'true');
                viewModel.startInstance(instanceId);
            }
        } else {
            viewModel.activateInstanceEditPanel(instanceId);
        }
    }

    constructor();
}

module.exports = InstanceListView;
