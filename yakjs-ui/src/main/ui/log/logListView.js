/**
 * LogListView
 * @constructor
 * @param {yak.ui.ViewContext} context
 * @param {jQuery} parent
 * @param {yak.ui.LogListViewModel} viewModel
 */
yak.ui.LogListView = function LogListView(parent, context, viewModel) {
    'use strict';

    /**
     * @type {yak.ui.LogListView}
     */
    var self = this;

    /**
     * @type {yak.ui.Template}
     */
    var template = context.template.load('logList');

    /**
     * @type {yak.ui.Template}
     */
    var itemTemplate = context.template.load('logListItem');

    this.handleRefreshClick = viewModel.reloadAndRefreshList;
    this.activate = viewModel.activate;

    /**
     * Constructor
     */
    function constructor() {
        console.log('yak.ui.LogListView.constructor');
        parent.html(template.build());

        viewModel.onItemsChanged = handleItemsChanged;

        context.ko.applyBindings(self, parent[0]);
        self.createList();
    }

    /**
     * Create the instance list.
     */
    this.createList = function createList() {

        var html = '';
        var itemContainer = $('.log-items', parent);

        // viewModel.items.sort(yak.ui.nameCompare);

        _.each(viewModel.items, function(item) {
            html += itemTemplate.build(item);
        });

        itemContainer.html(html);

        window.setTimeout(function scrollDown() {
            var height = itemContainer[0].scrollHeight;
            console.log(height);
            itemContainer.animate({ scrollTop: height }, 300);
        }, 100);
    };

    /**
     * Handle items changed event from view model.
     */
    function handleItemsChanged() {
        self.createList();
    }

    constructor();
};