/**
 * RestartInstanceRequestHandler
 * @constructor
 * @param {yak.YakServer} yakServer
 * @implements {yak.RequestHandler}
 */
yak.RestartInstanceRequestHandler = function RestartInstanceRequestHandler(yakServer) {
    'use strict';

    /**
     * @param {yak.api.StartInstanceRequest} request
     * @returns {yak.api.RestartInstanceResponse} response
     */
    this.handle = function handle(request) {
        yakServer.instanceManager.stop(request.instanceId);
        yakServer.instanceManager.start(request.instanceId);

        return new yak.api.RestartInstanceResponse(request.id);
    };
};
