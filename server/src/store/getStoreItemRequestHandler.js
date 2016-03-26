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
     * @param {yak.api.GetStoreItemRequest} request
     * @returns {yak.api.GetStoreItemResponse} response
     */
    this.handle = function handle(request) {
        var response = new yak.api.GetStoreItemResponse(request.id);

        if (request.key) {
            var value = yakServer.storeProvider.getValue(request.key);

            response.item = new yak.api.StoreKeyValueItem();
            response.item.key = request.key;
            response.item.value = value;
        } else {
            response.success = false;
            response.message = 'A store key must not be empty or null';
        }

        return response;
    };
};
