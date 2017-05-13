var StoreKeyValueItem = require('../storeKeyValueItem');
var ShowViewCommand = require('../../workspace/showViewCommand');
var StoreListView = require('../list/storeListView');

/**
 * @constructor
 * @struct
 * @param {!ViewModelContext} context
 */
function EditStoreItemViewModel(context) {
    'use strict';

    /**
     * @type {!EditStoreItemViewModel}
     */
    var self = this;

    /**
     * @type {StoreKeyValueItem}
     */
    this.storeItem = null;

    /**
     * @type {Function}
     */
    this.onItemChanged = _.noop;

    /**
     * @type {boolean}
     */
    this.isNewStoreItem = false;

    /**
     * @param {string} key
     */
    this.activate = function activate(key) {
        if (key) {
            requestStoreItem(key);
        } else {
            self.isNewStoreItem = true;
            self.storeItem = new StoreKeyValueItem();
            self.onItemChanged();
        }
    };

    this.refresh = function refresh() {
        requestStoreItem(self.storeItem.key);
    };

    /**
     * @param {string} key
     */
    function requestStoreItem(key) {
        if (key) {
            context.adapter.get('/storeitems/' + key).then(handleGetStoreItemResponse);
        }
    }

    /**
     * Create or update a store item.
     * @param {StoreKeyValueItem} storeItem
     */
    this.updateValue = function createOrUpdate(storeItem) {
        var request = {};

        request.storeItem = new StoreKeyValueItem();
        request.storeItem.key = storeItem.key;
        request.storeItem.value = storeItem.value;

        if (self.isNewStoreItem){
            context.adapter.post('/storeitems/', request).then(showStorePanel);
        } else {
            request.key = self.storeItem.key;
            context.adapter.put('/storeitems/' + self.storeItem.key, request).then(showStorePanel);
        }
    };

    this.cancel = function cancel() {
        showStorePanel();
    };

    this.deleteStore = function deleteStore() {
        if (self.storeItem.key) {
            context.adapter.deleteResource('/storeitems/' + self.storeItem.key).then(showStorePanel);
        }
    };

    function showStorePanel() {
        context.eventBus.post(new ShowViewCommand(StoreListView));
    }

    /**
     * @param {GetStoreItemResponse} response
     */
    function handleGetStoreItemResponse(response) {
        self.storeItem = new StoreKeyValueItem(response.storeItem.key);
        self.storeItem.value = response.storeItem.value;

        self.onItemChanged();
    }
}

module.exports = EditStoreItemViewModel;
