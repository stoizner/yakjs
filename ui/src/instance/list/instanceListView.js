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
     * @type {yak.ui.InstanceListView}
     */
    var self = this;

    /**
     * @type {yak.ui.Template}
     */
    var template = context.template.load('instanceList');

    /**
     * @type {yak.ui.Template}
     */
    var itemTemplate = context.template.load('instanceListItem');

    /**
     * Activate view.
     */
    this.activate = viewModel.activate;

    /**
     * Constructor
     */
    function constructor() {
        console.log('yak.ui.InstanceListView.constructor');
        parent.html(template.build());

        parent.find('[data-command=create]').click(viewModel.activateInstanceEditPanel);
        parent.find('[data-command=refresh]').click(viewModel.reloadAndRefreshList);

        viewModel.onItemsChanged = handleItemsChanged;

        self.createList();
    }

    /**
     * Create the instance list.
     */
    this.createList = function createList() {
        var html = '';
        var itemContainer = parent.find('.instance-items');

        viewModel.items.sort(yak.ui.nameCompare);

        _.each(viewModel.items, function toHTML(item) {
            item.isInstanceRunning = item.state === 'running';
            html += itemTemplate.build(item);
        });

        itemContainer.html(html);

        parent.find('[data-command=edit]').click(handleEditClick);
        parent.find('[data-command=start]').click(handleStartClick);
        parent.find('[data-command=stop]').click(handleStopClick);
    };

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

    /**
     * @param {string} id The instance id.
     */
    function handleContextEdit(id) {
        var contextItem = _.findWhere(viewModel.items, { id: id});
        viewModel.activateInstanceEditPanel(contextItem);
    }

    /**
     * Handle items changed event from view model.
     */
    function handleItemsChanged() {
        self.createList();
    }

    constructor();
};
