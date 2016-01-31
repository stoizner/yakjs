/**
 * @constructor
 * @param {yak.YakServer} yakServer
 */
yak.GetStoreItemRequestHandler = function GetStoreItemRequestHandler(yakServer) {
    'use strict';

    /**
     * @type {yak.Logger}
     */
    var log = new yak.Logger(this.constructor.name);

    /**
     * @type {yak.Store}
     */
    var store = yak.require('store');

    /**
     * @param {yak.api.GetStoreItemRequest} request
     * @returns {yak.api.GetStoreItemResponse} response
     */
    this.handle = function handle(request) {
        log.info('handle', {request: request});

        var response = new yak.api.GetStoreItemResponse(request.id);

        if (request.key) {
            var storeItem = store.getStoreItem(request.key);

            response.item = Object.assign(new yak.api.StoreItem(), storeItem);
        } else {
            response.success = false;
            response.message = 'A store key must not be empty or null';
        }

        return response;
    };
};
