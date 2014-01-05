/**
 * InstanceListView
 * @constructor
 * @param {yak.ui.ViewContext} context
 * @param {jQuery} parent
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
    var template = context.template.load('panelInstances');

    /**
     * @type {yak.ui.Template}
     */
    var itemTemplate = context.template.load('instanceItem');

    var contextMenuActions = {};

    this.handleNewInstanceClick = function() { viewModel.activateInstanceEditPanel(); };
    this.handleRefreshClick = viewModel.reloadAndRefreshList;
    this.activate = viewModel.activate;

    /**
     * Constructor
     */
    function constructor() {
        console.log('yak.ui.InstanceListView.constructor');
        parent.html(template.build());

        contextMenuActions.edit = handleContextEdit;
        contextMenuActions.start = viewModel.startInstance;
        contextMenuActions.stop = viewModel.stopInstance;
        contextMenuActions.restart = viewModel.restartInstance;
        contextMenuActions.delete = viewModel.deleteInstance;

        viewModel.onItemsChanged = handleItemsChanged;

        context.ko.applyBindings(self, parent[0]);
        self.createList();
    }

    /**
     * Create the instance list.
     */
    this.createList = function createList() {

        var html = '';
        var itemContainer = $('.instance-items', parent);

        viewModel.items.sort(yak.ui.nameCompare);

        _.each(viewModel.items, function(item) {
            html += itemTemplate.build(item);
        });

        itemContainer.html(html);

        $('.instance-item-open-context', itemContainer).contextMenu($('#instance-item-context'), handleMenuClicked);
    };

    function handleContextEdit(name) {

        var contextItem = _.findWhere(viewModel.items, { name: name});
        viewModel.activateInstanceEditPanel(contextItem);
    }

    /**
     * Handle items changed event from view model.
     */
    function handleItemsChanged() {
        self.createList();
    }

    /**
     * Handle context menu item clicked event.
     * @param event
     * @param context
     */
    function handleMenuClicked(context, event) {

        var instanceName = context.closest('.list-item').attr('data-instance');
        var menuAction = $(event.target).attr('data-menu');

        // Registered callback functions lookup for context menu actions.
        if (contextMenuActions.hasOwnProperty(menuAction)) {
            contextMenuActions[menuAction](instanceName);
        } else {
            console.warn('No context menu handler found for ' + menuAction);
        }
    }

    constructor();
};