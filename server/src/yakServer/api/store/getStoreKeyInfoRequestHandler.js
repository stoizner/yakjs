/**
 * GetStoreKeyInfoRequestHandler
 * @constructor
 * @param {yak.YakServer} yakServer
 * @implements {yak.RequestHandler}
 */
yak.GetStoreKeyInfoRequestHandler = function GetStoreKeyInfoRequestHandler(yakServer) {
    'use strict';

    /**
     * @type {yak.Store}
     */
    var store = yak.require('store');

    /**
     * @param {yak.api.GetStoreKeyInfoRequest} request
     * @returns {yak.api.GetStoreKeyInfoResponse} response
     */
    this.handle = function handle(request) {
        var logger = yakServer.getLogger();
        logger.debug('GetStoreKeyInfoRequestHandler', { request: request });

        var response = new yak.api.GetStoreKeyInfoResponse(request.id);
         response.keys = [];

        var storeData = store.getStore();

        _.each(storeData, function each(entry) {
            response.keys.push({key: entry.key, description:entry.description});
        });

       return response;
    };
};
