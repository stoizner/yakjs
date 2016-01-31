/**
 * @constructor
 * @param {yak.YakServer} yakServer
 */
yak.DeleteStoreItemRequestHandler = function DeleteStoreItemRequestHandler(yakServer) {
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
     * @param {yak.api.SetStoreValueRequest} request
     * @returns {yak.api.DeleteStoreItemResponse} response
     */
    this.handle = function handle(request) {
        log.info('handle', {request: request});

        var response = new yak.api.DeleteStoreItemResponse(request.id);
        response.success = store.deleteStoreItem(request.key);

        return response;
    };
};
