/**
 * DeleteStoreItemRequestHandler
 * @constructor
 * @param {yak.YakServer} yakServer
 * @implements {yak.RequestHandler}
 */
yak.DeleteStoreItemRequestHandler = function DeleteStoreItemRequestHandler(yakServer) {
    'use strict';

    /**
     * @type {yak.Store}
     */
    var store = yak.require('store');

    /**
     * @param {yak.api.SetStoreValueRequest} request
     * @returns {yak.api.DeleteStoreItemResponse} response
     */
    this.handle = function handle(request) {
        var logger = yakServer.getLogger();
        logger.debug('DeleteStoreItemRequestHandler', { request: request });

        var response = new yak.api.DeleteStoreItemResponse(request.id);
        response.success = store.deleteKey(request.key);

        return response;
    };
};
