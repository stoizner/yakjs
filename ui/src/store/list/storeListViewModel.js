var StoreKeyValueItem = require('../storeKeyValueItem');
var EditStoreItemView = require('../edit/editStoreItemView');
var StoreNodeItem = require('./storeNodeItem');
var StoreNodeItemType = require('./storeNodeItemType');
var ShowViewCommand = require('../../workspace/showViewCommand');

/**
 * @constructor
 * @struct
 * @param {!ViewModelContext} context
 */
function StoreListViewModel(context) {
    'use strict';

    /**
     * @type {!StoreListViewModel}
     */
    var self = this;

    /**
     * @type {!Array<!StoreNodeItem>}
     */
    this.items = [];

    /**
     * @type {!StoreNodeItem}
     */
    this.rootNode = new StoreNodeItem(null, 'root');

    /**
     * @type {Function}
     */
    this.onItemsChanged = _.noop;

    /**
     * Constructor
     */
    function constructor() {
        console.log('StoreListViewModel.constructor');
    }

    this.activate = function activate() {
        console.log('StoreListViewModel.active');
        context.adapter.get('/storeitems/keys').then(handleGetStoreKeyInfoResponse);
    };

    this.reloadAndRefreshList = function reloadAndRefreshList() {
        context.adapter.get('/storeitems/keys').then(handleGetStoreKeyInfoResponse);
    };

    /**
     * @param {!Object} response
     */
    function handleGetStoreKeyInfoResponse(response) {
        /**
         * @param {string} key
         * @returns {!StoreKeyValueItem}
         */
        function toStoreItem(key) {
            return new StoreKeyValueItem(key);
        }

        if (response.keys) {
            self.items = response.keys.sort().map(toStoreItem);

            createItemTree();

            self.onItemsChanged();
        }
    }

    /**
     * Sort object by key property.
     * @param {!StoreKeyInfo} left
     * @param {!StoreKeyInfo} right
     * @returns {number}
     */
    function byKey(left, right) {
        return left.key.localeCompare(right.key);
    }

    /**
     * Initialize the item tree.
     */
    function createItemTree() {
        self.rootNode = new StoreNodeItem();

        var groupNodes = {};

        /**
         * @param {!StoreKeyValueItem} item
         */
        function createNodeForItem(item) {
            var node = new StoreNodeItem(self.rootNode, StoreNodeItemType.ITEM, item.name);
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
     * @param {StoreNodeItem} node
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
                groupNode = new StoreNodeItem(parentGroupNode, StoreNodeItemType.GROUP, groupName);
                groupNodes[fullGroupName] = groupNode;
                parentGroupNode.nodes.push(groupNode);
            }

            parentGroupNode = groupNode;
        });

        parentGroupNode.nodes.push(node);
    }

    /**
     * Show and activate the store entry edit panel for given key.
     * @param {StoreKeyInfo} [storeKeyInfo]
     */
    this.activateStoreEditPanel = function activateStoreEditPanel(storeKeyInfo) {
        context.eventBus.post(new ShowViewCommand(EditStoreItemView, storeKeyInfo));
    };

    /**
     * Get value for store key.
     * @param {string} key
     * @param {Function} callback
     */
    this.getValue = function getValue(key, callback) {
        context.adapter.get('/storeItems/' +  key).then(callback);
    };

    constructor();
}

module.exports = StoreListViewModel;
