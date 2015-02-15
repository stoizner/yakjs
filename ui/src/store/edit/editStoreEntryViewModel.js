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
     * @param {yak.api.StoreKeyInfo} keyInfo
     */
    this.activate = function activate(keyInfo) {
        console.log('EditStoreEntryViewModel.activate', { keyInfo:keyInfo });

        if (keyInfo) {
            var request = new yak.api.GetStoreValueRequest();
            request.key = keyInfo.key;

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
        context.eventBus.post(new yak.ui.ActivatePanelCommand('panel-store'));
    };

    /**
     * @param {yak.api.GetStoreValueResponse} response
     */
    function handleGetStoreValueResponse(response) {
        console.log('handleGetStoreValueResponse', response);

        self.item = {
            key: response.key,
            description: response.description,
            value: response.value
        };

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