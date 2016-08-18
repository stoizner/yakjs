/**
 * GetModuleNamesRequestHandler
 * @constructor
 * @param {yak.YakServer} yakServer
 */
yak.GetModuleNamesRequestHandler = function GetModuleNamesRequestHandler(yakServer) {
    'use strict';

    /**
     * @param {yak.api.GetModuleNamesRequest} request
     * @returns {yak.api.GetModuleNamesResponse} response
     */
    this.handle = function handle(request) {
        var response = new yak.api.GetModuleNamesResponse(request.id);
        response.moduleNames = yakServer.moduleProvider.getAllModuleNames();
        return response;
    };
};
