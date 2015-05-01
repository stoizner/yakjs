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

    /**
     * @type {yak.ui.Template}
     */
    var groupTemplate = context.template.load('storeGroupItem');

    this.activate = function activate() { viewModel.activate(); };

    /**
     * Constructor
     */
    function constructor() {
        console.log('yak.ui.StoreListView.constructor');
        parent.html(template.build());

        parent.find('[data-command=create]').click(_.partial(viewModel.activateStoreEditPanel, null));
        parent.find('[data-command=refresh]').click(viewModel.reloadAndRefreshList);

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
    function createList2() {
        var html = '';
        var itemContainer = $('.store-items', parent);

        _.each(viewModel.items, function createListItem(item) {
            html += itemTemplate.build(item);
        });

        itemContainer.html(html);
    }

    function createList() {
        var rootItemListContainer = parent.find('[data-list=items]');
        var rootItemList = createItemList(viewModel.rootGroup.items);
        rootItemListContainer.html(rootItemList);

        var rootGroupsListContainer = parent.find('[data-list=groups]');
        var rootGroupsList = createGroupList(viewModel.rootGroup.groups);
        rootGroupsListContainer.html(rootGroupsList);

        parent.find('[data-list=items]').click(handleListClick);
    }

    /**
     * @param {!Object<string, !yak.ui.StoreGroupItem>} groupsMap
     * @return {string} The group list HTML.
     */
    function createGroupList(groupsMap) {
        var html = '';

        var groups = _.toArray(groupsMap);

        if (groups) {
            groups = _.sortBy(groups, 'name');

            _.each(groups, function appendGroupBlock(group) {
                html += createGroupBlock(group);
            });
        }

        return html;
    }

    /**
     * @param {!yak.ui.StoreGroupItem} group
     * @returns {string} The group item HTML
     */
    function createGroupBlock(group) {
        var groupItem = {
            name: group.name,
            groups: createGroupList(group.groups),
            items: createItemList(group.items)
        };

        return groupTemplate.build(groupItem);
    }

    /**
     * @param {!Array<!yak.ui.StoreItem>} items
     * @returns {string} The item list as HTML.
     */
    function createItemList(items) {
        var html = '';

        _.each(items, function createListItem(item) {
            html += itemTemplate.build(item);
        });

        return html;
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
