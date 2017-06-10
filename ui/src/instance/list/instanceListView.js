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
        createList();
    }

    /**
     * Create the instance list.
     */
    function createList() {
        parent.html(template.build({instances: viewModel.items}));

        itemList = parent.find('[data-element=instanceList]');
        itemList.click(handleListClick);

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
        var elementName = clickTarget.attr('data-element');

        var handlers = {
            startButton: viewModel.startInstance,
            stopButton: viewModel.stopInstance
        };

        if (instanceId) {
            if (handlers[elementName]) {
                handlers[elementName](instanceId);
            } else {
                viewModel.activateInstanceEditPanel(instanceId);
            }
        }
    }

    constructor();
}

module.exports = InstanceListView;
