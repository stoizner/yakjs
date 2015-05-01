/**
 * EditStoreEntryViewModel
 * @constructor
 * @param {yak.ui.ViewModelContext} context
 */
yak.ui.EditStoreEntryViewModel = function EditStoreEntryViewModel(context) {
    'use strict';

    /**
     * @type {yak.ui.EditStoreEntryViewModel}
     */
    var self = this;

    /**
     * @type {?string}
     */
    var lastRequestId = null;

    /**
     * @type {yak.ui.StoreItem}
     */
    this.item = null;

    /**
     * @type {Function}
     */
    this.onItemChanged = _.noop;

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
        console.log('EditStoreEntryViewModel.activate', { key:key });

        if (key) {
            var request = new yak.api.GetStoreValueRequest();
            request.key = key;

            lastRequestId = request.id;
            context.adapter.sendRequest(request, handleGetStoreValueResponse);
        } else {
            self.item = null;
            self.onItemChanged();
        }
    };

    /**
     * Create or update a store item.
     * @param {yak.ui.StoreItem} storeItem
     */
    this.createOrUpdate = function createOrUpdate(storeItem) {
        console.log('EditStoreEntryViewModel.createOrUpdate', { storeItem: storeItem });

        self.item = storeItem;

        var request = new yak.api.SetStoreValueRequest();
        request.key = self.item.key;
        request.description = self.item.description;
        request.value = self.item.value;

        lastRequestId = request.id;
        context.adapter.sendRequest(request, handleSetStoreValueResponse);
    };

    /**
     * Cancel instance edit.
     */
    this.cancel = function cancel() {
        showStorePanel();
    };

    /**
     * @param {string} key
     */
    this.deleteStore = function deleteStore() {
        if (self.item) {
            console.log('deleteStore', {key: self.item.key});
            context.adapter.sendRequest(new yak.api.DeleteStoreItemRequest(self.item.key), showStorePanel);
        }
    };

    function showStorePanel() {
        context.eventBus.post(new yak.ui.ActivatePanelCommand('panel-store'));
    }

    /**
     * @param {yak.api.GetStoreValueResponse} response
     */
    function handleGetStoreValueResponse(response) {
        console.log('handleGetStoreValueResponse', response);

        self.item = new yak.ui.StoreItem(response.key);
        self.item.value  = response.value;

        self.onItemChanged();
    }

    /**
     * @param {yak.api.SetStoreValueResponse} response
     */
    function handleSetStoreValueResponse(response) {
        if (response.requestId === lastRequestId && response.success) {
            context.eventBus.post(new yak.ui.ActivatePanelCommand('panel-store'));
        }
    }

    constructor();
};