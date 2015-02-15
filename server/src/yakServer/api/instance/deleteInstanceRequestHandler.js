/**
 * DeleteInstanceRequestHandler
 * @constructor
 * @param {yak.YakServer} yakServer
 * @implements {yakServiceMessageHandler}
 */
yak.DeleteInstanceRequestHandler = function DeleteInstanceRequestHandler(yakServer) {
    'use strict';

    /**
     * @param {yak.api.DeleteInstanceRequest} request
     * @returns {yak.api.DeleteInstanceResponse} response
     */
    this.handle = function handle(request) {
        yakServer.instanceManager.removeInstance(request.instanceId);
        return new yak.api.DeleteInstanceResponse(request.id);
    };
};
