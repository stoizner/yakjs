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
    var lastGetValueRequestCallback = yak.ui.noop;

    /**
     * @type {Array.<yak.ui.StoreKeyInfo>}
     */
    this.items = [];

    /**
     * @type {Function}
     */
    this.onItemsChanged = yak.ui.noop;

    /**
     * Constructor
     */
    function constructor() {
        console.log('yak.ui.StoreListViewModel.constructor');
        context.eventBus.on(yak.api.GetStoreKeyInfoResponse).register(handleGetStoreKeyInfoResponse);
        context.eventBus.on(yak.api.DeleteStoreItemResponse).register(self.reloadAndRefreshList);
        context.eventBus.on(yak.api.SetStoreValueResponse).register(self.reloadAndRefreshList);
        context.eventBus.on(yak.api.GetStoreValueResponse).register(handleGetStoreValueResponse);
    }

    /**
     * Activate View
     */
    this.activate = function activate() {
        console.log('yak.ui.StoreListViewModel.active');
        context.webSocket.send(new yak.api.GetStoreKeyInfoRequest());
    };

    /**
     * Reload and refresh list.
     */
    this.reloadAndRefreshList = function reloadAndRefreshList() {
        // SMELL: Make the refresh not so brutal.
        context.webSocket.send(new yak.api.GetStoreKeyInfoRequest());
    };

    /**
     * @param key
     */
    this.deleteEntry = function deleteEntry(key) {
        console.log('deleteEntry', { key: key });
        context.webSocket.send(new yak.api.DeleteStoreItemRequest(key));
    };

    /**
     * @param {yak.api.GetLogInfoResponse} response
     */
    function handleGetStoreKeyInfoResponse(response) {
        console.log('handleGetStoreKeyInfoResponse');

        self.items = response.keys;
        self.onItemsChanged();
    }

    /**
     * Show and activate the store entry edit panel for given key.
     * @param {yak.api.StoreKeyInfo} [keyInfo]
     */
    this.activateStoreEditPanel = function activateStoreEditPanel(keyInfo) {
        context.eventBus.post(new yak.ui.ActivatePanelCommand('panel-storeEntry-edit', keyInfo ));
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
        context.webSocket.send(request);
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
        request.description = self.item.description;
        request.value = self.item.value;

        context.webSocket.send(request);
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