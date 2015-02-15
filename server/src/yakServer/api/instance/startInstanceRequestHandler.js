/**
 * StartInstanceRequestHandler
 * @constructor
 * @param {yak.YakServer} yakServer
 * @implements {yak.RequestHandler}
 */
yak.StartInstanceRequestHandler = function StartInstanceRequestHandler(yakServer) {
    'use strict';

    /**
     * @param {yak.api.StartInstanceRequest} request
     * @returns {yak.api.StartInstanceResponse} response
     */
    this.handle = function handle(request) {
        yakServer.instanceManager.start(request.instanceId);
        return new yak.api.StartInstanceResponse(request.id);
    };
};
