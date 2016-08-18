/**
 * @constructor
 * @param {yak.YakServer} yakServer
 */
yak.DeleteModuleRequestHandler = function DeleteModuleRequestHandler(yakServer) {
    'use strict';

    /**
     * @param {yak.api.DeleteModuleRequest} request
     * @returns {!yak.api.DeleteModuleResponse} response
     */
    this.handle = function handle(request) {
        var response = new yak.api.DeleteModuleResponse(request.id);

        try {
            yakServer.moduleProvider.deleteModule(request.moduleName);
        } catch(ex) {
            response.success = false;
            response.message = ex.message;
        }

        return response;
    };
};
