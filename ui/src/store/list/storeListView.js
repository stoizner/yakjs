/**
 * @constructor
 * @param {yak.ui.ViewContext} context
 * @param {jQuery} parent
 * @param {yak.ui.StoreListViewModel} viewModel
 */
yak.ui.StoreListView = function StoreListView(parent, context, viewModel) {
    'use strict';

    /**
     * @type {yak.ui.StoreListView}
     */
    var self = this;

    /**
     * @type {yak.ui.Template}
     */
    var template = context.template.load('storeList');

    /**
     * @type {yak.ui.Template}
     */
    var itemTemplate = context.template.load('storeListItem');

    this.activate = function activate() { viewModel.activate(); };

    /**
     * Constructor
     */
    function constructor() {
        console.log('yak.ui.StoreListView.constructor');
        parent.html(template.build());

        parent.find('[data-command=create]').click(_.partial(viewModel.activateStoreEditPanel, null));
        parent.find('[data-command=refresh]').click(viewModel.reloadAndRefreshList);
        parent.find('.store-items').click(handleListClick);

        viewModel.onItemsChanged = handleItemsChanged;

        createList();
    }

    /**
     * @param {jQuery.Event} event
     */
    function handleListClick(event) {
        var listItem = $(event.target).closest('.list-item');
        var storeKey = listItem.attr('data-key');

        if (storeKey) {
            viewModel.activateStoreEditPanel(storeKey);
        }
    }

    /**
     * Create the instance list.
     */
    function createList() {
        var html = '';
        var itemContainer = $('.store-items', parent);

        _.each(viewModel.items, function createListItem(item) {
            html += itemTemplate.build(item);
        });

        itemContainer.html(html);
    }

    /**
     * Handle items changed event from view model.
     */
    function handleItemsChanged() {
        createList();
    }

    /**
     * @param {string} key
     * @param {string} value
     */
    function handleSaveAsFile(key, value) {
        var downloadLink = document.createElement('a');
        downloadLink.href = 'data:application/text,' + encodeURIComponent(value);
        downloadLink.download = key + '.txt';
        downloadLink.target = '_blank';
        downloadLink.click();
    }

    constructor();
};
