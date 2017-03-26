/**
 * StoreListViewModel
 * @constructor
 * @param {!yak.ui.ViewModelContext} context
 */
yak.ui.StoreListViewModel = function StoreListViewModel(context) {
    'use strict';

    /**
     * @type {!yak.ui.StoreListViewModel}
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
     * @type {!Array<yak.ui.StoreNodeItem>}
     */
    this.items = [];

    /**
     * @type {!yak.ui.StoreNodeItem}
     */
    this.rootNode = new yak.ui.StoreNodeItem(null, 'root');

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

    this.activate = function activate() {
        console.log('yak.ui.StoreListViewModel.active');
        context.adapter.get('/storeitems/keys').then(handleGetStoreKeyInfoResponse);
    };

    this.reloadAndRefreshList = function reloadAndRefreshList() {
        context.adapter.get('/storeitems/keys').then(handleGetStoreKeyInfoResponse);
    };

    /**
     * @param {!yak.api.GetStoreKeysResponse} response
     */
    function handleGetStoreKeyInfoResponse(response) {
        /**
         * @param {string} key
         * @returns {!yak.ui.StoreItem}
         */
        function toStoreItem(key) {
            return new yak.ui.StoreKeyValueItem(key);
        }

        if (response.keys) {
            self.items = response.keys.sort().map(toStoreItem);

            createItemTree();

            self.onItemsChanged();
        }
    }

    /**
     * Sort object by key property.
     * @param {!yak.api.StoreKeyInfo} left
     * @param {!yak.api.StoreKeyInfo} right
     * @returns {number}
     */
    function byKey(left, right) {
        return left.key.localeCompare(right.key);
    }

    /**
     * Initialize the item tree.
     */
    function createItemTree() {
        self.rootNode = new yak.ui.StoreNodeItem();

        var groupNodes = {};

        /**
         * @param {!yak.ui.StoreKeyValueItem} item
         */
        function createNodeForItem(item) {
            var node = new yak.ui.StoreNodeItem(self.rootNode, yak.ui.StoreNodeItemType.ITEM, item.name);
            node.key = item.key;

            if (item.namespace) {
                addNodeToGroupNode(node, item.namespace, groupNodes);
            } else {
                self.rootNode.nodes.push(node);
            }
        }

        _.each(self.items, createNodeForItem);
    }

    /**
     * @param {yak.ui.StoreNodeItem} node
     * @param {string} namespace
     * @param {Object<string, string>} groupNodes
     */
    function addNodeToGroupNode(node, namespace, groupNodes) {
        var groupNames = namespace.split('.');

        var parentGroupNode = self.rootNode;
        var fullGroupName = '';

        groupNames.forEach(function(groupName) {
            fullGroupName = fullGroupName + '.' + groupName;

            var groupNode = groupNodes[fullGroupName];

            if (!groupNode) {
                groupNode = new yak.ui.StoreNodeItem(parentGroupNode, yak.ui.StoreNodeItemType.GROUP, groupName);
                groupNodes[fullGroupName] = groupNode;
                parentGroupNode.nodes.push(groupNode);
            }

            parentGroupNode = groupNode;
        });

        parentGroupNode.nodes.push(node);
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
    this.updateValue = function createOrUpdate(storeItem) {
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
