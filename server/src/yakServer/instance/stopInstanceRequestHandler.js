/**
 * StopInstanceRequestHandler
 * @constructor
 * @param {yak.YakServer} yakServer
 * @implements {yakServiceMessageHandler}
 */
yak.StopInstanceRequestHandler = function StopInstanceRequestHandler(yakServer) {
    'use strict';

    /**
     * @param {yak.api.StopInstanceRequest} request
     * @returns {yak.api.StopInstanceResponse} response
     */
    this.handle = function handle(request) {
        yakServer.instanceManager.stop(request.instanceId);
        return new yak.api.StopInstanceResponse(request.id);
    };
};
