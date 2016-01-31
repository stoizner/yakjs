/**
 * @constructor
 * @param {yak.YakServer} yakServer
 */
yak.SetStoreItemRequestHandler = function SetStoreItemRequestHandler(yakServer) {
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
     * @param {yak.api.SetStoreItemRequest} request
     * @returns {yak.api.SetStoreItemResponse} response
     */
    this.handle = function handle(request) {
        log.info('handle', {request: request});

        var response = new yak.api.SetStoreItemResponse(request.id);
        response.requestId = request.id;

        if (request.item.key) {
            store.setValue(request.item.key, request.item.value);

            // Key was changed, so delete old store item.
            if (request.key && request.key != request.item.key) {
                store.deleteStoreItem(request.key);
            }
        } else {
            response.success = false;
            response.message = 'A store key must not be empty or null.';
        }

        return response;
    };
};
