/**
 * @constructor
 * @param {yak.ui.ViewModelContext} context
 */
yak.ui.EditStoreItemViewModel = function EditStoreItemViewModel(context) {
    'use strict';

    /**
     * @type {yak.ui.EditStoreItemViewModel}
     */
    var self = this;

    /**
     * @type {yak.ui.StoreKeyValueItem}
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
     * Constructor
     */
    function constructor() {
    }

    /**
     * Activate view
     * @param {string} key
     */
    this.activate = function activate(key) {
        if (key) {
            requestStoreItem(key);
        } else {
            self.isNewStoreItem = true;
            self.storeItem = new yak.ui.StoreKeyValueItem();
            self.onItemChanged();
        }
    };

    /**
     * Refresh the store item.
     */
    this.refresh = function refresh() {
        requestStoreItem(self.storeItem.key);
    };

    /**
     * Request store item.
     * @param {string} key
     */
    function requestStoreItem(key) {
        if (key) {
            var request = new yak.api.GetStoreItemRequest();
            request.key = key;

            context.adapter.sendRequest(request, handleGetStoreItemResponse);
        }
    }

    /**
     * Create or update a store item.
     * @param {yak.ui.StoreKeyValueItem} storeItem
     */
    this.updateValue = function createOrUpdate(storeItem) {
        var request = new yak.api.SetStoreItemRequest();

        request.item = new yak.api.StoreKeyValueItem();
        request.item.key = storeItem.key;
        request.item.value = storeItem.value;

        if (!self.isNewStoreItem) {
            request.key = self.storeItem.key;
        }

        context.adapter.sendRequest(request, handleSetStoreItemResponse);
    };

    /**
     * Cancel instance edit.
     */
    this.cancel = function cancel() {
        showStorePanel();
    };

    /**
     * Deletes a store item.
     */
    this.deleteStore = function deleteStore() {
        if (self.storeItem.key) {
            context.adapter.sendRequest(new yak.api.DeleteStoreItemRequest(self.storeItem.key), showStorePanel);
        }
    };

    function showStorePanel() {
        context.eventBus.post(new yak.ui.ShowViewCommand(yak.ui.StoreListView));
    }

    /**
     * @param {yak.api.GetStoreItemResponse} response
     */
    function handleGetStoreItemResponse(response) {
        self.storeItem = new yak.ui.StoreKeyValueItem(response.item.key);
        self.storeItem.value = response.item.value;

        self.onItemChanged();
    }

    /**
     * @param {yak.api.GetStoreItemResponse} response
     */
    function handleSetStoreItemResponse(response) {
        if (response.success) {
            showStorePanel();
        }
    }

    constructor();
};
