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

        if (key) {
            var storeItem = store.getStoreItem(key);

            response.key = key;
            response.value = storeItem.value;
        } else {
            response.success = false;
            response.message = 'A store key must not be empty or null';
        }

        return response;
    };
};
