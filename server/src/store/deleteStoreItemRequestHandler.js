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
     * @param {yak.api.SetStoreValueRequest} request
     * @returns {yak.api.DeleteStoreItemResponse} response
     */
    this.handle = function handle(request) {
        var response = new yak.api.DeleteStoreItemResponse(request.id);
        response.success = yakServer.storeProvider.deleteValue(request.key);

        return response;
    };
};
