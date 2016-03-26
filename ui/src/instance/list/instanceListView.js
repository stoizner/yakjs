/**
 * InstanceListView
 * @constructor
 * @param {jQuery} parent
 * @param {yak.ui.ViewContext} context
 * @param {yak.ui.InstanceListViewModel} viewModel
 */
yak.ui.InstanceListView = function InstanceListView(parent, context, viewModel) {
    'use strict';

    /**
     * @type {yak.ui.Template}
     */
    var template = context.template.load('instanceList');

    /**
     * Activate view.
     */
    this.activate = viewModel.activate;

    /**
     * Constructor
     */
    function constructor() {
        viewModel.onItemsChanged = createList;
        createList();
    }

    /**
     * Create the instance list.
     */
    function createList() {
        parent.html(template.build({instances: viewModel.items}));

        parent.find('[data-command=edit]').click(handleEditClick);
        parent.find('[data-command=start]').click(handleStartClick);
        parent.find('[data-command=stop]').click(handleStopClick);

        parent.find('[data-command=create]').click(function() { viewModel.activateInstanceEditPanel(); });
        parent.find('[data-command=refresh]').click(viewModel.reloadAndRefreshList);
    }

    /**
     * @param {jQuery.Event} event
     */
    function handleEditClick(event) {
        var instanceId = $(event.target).closest('[data-id]').attr('data-id');
        var contextItem = _.findWhere(viewModel.items, { id: instanceId});
        viewModel.activateInstanceEditPanel(contextItem);
    }

    /**
     * @param {jQuery.Event} event
     */
    function handleStartClick(event) {
        var instanceId = $(event.target).closest('[data-id]').attr('data-id');
        viewModel.startInstance(instanceId);
    }

    /**
     * @param {jQuery.Event} event
     */
    function handleStopClick(event) {
        var instanceId = $(event.target).closest('[data-id]').attr('data-id');
        viewModel.stopInstance(instanceId);
    }

    constructor();
};
