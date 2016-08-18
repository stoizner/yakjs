/**
 * @constructor
 * @param {yak.YakServer} yakServer
 */
yak.ClearModuleCacheRequestHandler = function ClearModuleCacheRequestHandler(yakServer) {
    'use strict';

    /**
     * @param {yak.api.ClearModuleCacheRequest} request
     * @returns {!yak.api.ClearModuleCacheResponse} response
     */
    this.handle = function handle(request) {
        var response = new yak.api.DeleteModuleResponse(request.id);

        try {
            yakServer.moduleProvider.clearModuleCache();
        } catch(ex) {
            response.success = false;
            response.message = ex.message;
        }

        return response;
    };
};
