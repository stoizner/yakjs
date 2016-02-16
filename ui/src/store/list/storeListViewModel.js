/**
 * StoreListViewModel
 * @constructor
 * @param {yak.ui.ViewModelContext} context
 */
yak.ui.StoreListViewModel = function StoreListViewModel(context) {
    'use strict';

    /**
     * @type {yak.ui.StoreListViewModel}
     */
    var self = this;

    /**
     * @type {?string}
     */
    var lastGetValueRequestId = null;

    /**
     * @type {Function}
     */
    var lastGetValueRequestCallback = _.noop;

    /**
     * @type {!Array<yak.ui.StoreItem>}
     */
    this.items = [];

    /**
     * @type {!yak.ui.StoreGroupItem}
     */
    this.rootGroup = new yak.ui.StoreGroupItem('root');

    /**
     * @type {Function}
     */
    this.onItemsChanged = _.noop;

    /**
     * Constructor
     */
    function constructor() {
        console.log('yak.ui.StoreListViewModel.constructor');
    }

    /**
     * Activate View
     */
    this.activate = function activate() {
        console.log('yak.ui.StoreListViewModel.active');
        context.adapter.sendRequest(new yak.api.GetStoreKeysRequest(), handleGetStoreKeyInfoResponse);
    };

    /**
     * Reload and refresh list.
     */
    this.reloadAndRefreshList = function reloadAndRefreshList() {
        context.adapter.sendRequest(new yak.api.GetStoreKeysRequest(), handleGetStoreKeyInfoResponse);
    };

    /**
     * @param {yak.api.GetStoreKeysResponse} response
     */
    function handleGetStoreKeyInfoResponse(response) {
        /**
         * @param {!yak.api.StoreKeyInfo} keyInfo
         * @returns {yak.ui.StoreItem} The store list item.
         */
        function toStoreItem(keyInfo) {
            return new yak.ui.StoreItem(keyInfo.key);
        }

        self.items = _.map(response.keys, toStoreItem);

        initializeGroupsBasedOnNamespacedKeys();

        self.onItemsChanged();
    }

    /**
     * Initialize group structure based on namespaced keys.
     */
    function initializeGroupsBasedOnNamespacedKeys() {
        self.rootGroup = new yak.ui.StoreGroupItem('');

        /**
         * @param {!yak.ui.StoreItem} item
         */
        function addToGroup(item) {
            var group = self.rootGroup;
            if (item.namespace) {
                group = findOrCreateGroup(self.rootGroup.groups, item.namespace);
            }

            group.items.push(item);
        }

        _.each(self.items, addToGroup);
    }

    /**
     * @param {!Object<string, !yak.ui.StoreGroupItem>} groups
     * @param {string} namespacedGroupName Namespaced group name (e.g.: com.yakjs.group)
     * @returns {!yak.ui.StoreGroupItem} The group for the group name.
     */
    function findOrCreateGroup(groups, namespacedGroupName) {
        var namespaceIndex = namespacedGroupName.indexOf('.');
        var groupName = namespacedGroupName;
        var subGroupName = '';
        var group;

        if (namespaceIndex >= 0) {
            groupName = namespacedGroupName.substring(0, namespaceIndex);
            subGroupName = namespacedGroupName.substring(namespaceIndex + 1);
        }

        if (!groups[groupName]) {
            group = new yak.ui.StoreGroupItem(groupName);
            groups[groupName] = group;
        } else {
            group = groups[groupName];
        }

        if (subGroupName) {
            group = findOrCreateGroup(group.groups, subGroupName);
        }

        return group;
    }

    /**
     * Show and activate the store entry edit panel for given key.
     * @param {yak.api.StoreKeyInfo} [storeKeyInfo]
     */
    this.activateStoreEditPanel = function activateStoreEditPanel(storeKeyInfo) {
        context.eventBus.post(new yak.ui.ShowViewCommand(yak.ui.EditStoreItemView, storeKeyInfo));
    };

    /**
     * Get value for store key.
     * @param {string} key
     * @param {Function} callback
     */
    this.getValue = function getValue(key, callback) {
        var request = new yak.api.GetStoreValueRequest();
        request.key = key;

        lastGetValueRequestId = request.id;
        lastGetValueRequestCallback = callback;
        context.adapter.sendRequest(request, handleGetStoreValueResponse);
    };

    /**
     * Create or update a store item.
     * @param {yak.ui.StoreItem} storeItem
     */
    this.createOrUpdate = function createOrUpdate(storeItem) {
        console.log('StoreListViewModel.createOrUpdate', { storeItem: storeItem });

        self.item = storeItem;

        var request = new yak.api.SetStoreValueRequest();
        request.key = self.item.key;
        request.value = self.item.value;

        context.adapter.sendRequest(request, self.reloadAndRefreshList);
    };

    /**
     * @param {yak.api.GetStoreValueResponse} response
     */
    function handleGetStoreValueResponse(response) {
        if (lastGetValueRequestId === response.requestId) {
            lastGetValueRequestCallback(response.key, response.value);
        }
    }

    constructor();
};
