/**
 * @constructor
 * @param {yak.YakServer} yakServer
 */
yak.GetStoreKeysRequestHandler = function GetStoreKeysRequestHandler(yakServer) {
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
     * @param {yak.api.GetStoreKeysRequest} request
     * @returns {yak.api.GetStoreKeysResponse} response
     */
    this.handle = function handle(request) {
        log.info('handle', {request: request});

        var response = new yak.api.GetStoreKeysResponse(request.id);
        response.keys = [];

        var storeData = store.getStore();

        response.keys = _.map(storeData, function toKeyInfo(item) {
            var keyInfo = new yak.api.StoreKeyInfo();
            keyInfo.key = item.key;
            return keyInfo;
        });

       return response;
    };
};
