/**
 * GetStoreValueRequestHandler
 * @constructor
 * @param {yak.YakServer} yakServer
 * @implements {yak.RequestHandler}
 */
yak.GetStoreValueRequestHandler = function GetStoreValueRequestHandler(yakServer) {
    'use strict';

    /**
     * @type {yak.Store}
     */
    var store = yak.require('store');

    /**
     * @param {yak.api.GetStoreValueRequest} request
     * @returns {yak.api.GetStoreValueResponse} response
     */
    this.handle = function handle(request) {
        var logger = yakServer.getLogger();
        var key = request.key;

        logger.debug('GetStoreValueRequestHandler', { key: key });
        var response = new yak.api.GetStoreValueResponse(request.id);

        var storeItem = store.getStoreItem(key);

        response.key = key;
        response.description = storeItem.description;
        response.value = storeItem.value;

        return response;
    };
};
