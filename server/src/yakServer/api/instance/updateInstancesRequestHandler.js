/**
 * UpdateInstanceRequestHandler
 * @constructor
 * @param {yak.YakServer} yakServer
 * @implements {yakServiceMessageHandler}
 */
yak.UpdateInstanceRequestHandler = function UpdateInstanceRequestHandler(yakServer) {
    'use strict';

    /**
     * @param {yak.api.UpdateInstanceRequest} request
     * @returns {yak.api.UpdateInstanceResponse} response
     */
    this.handle = function handle(request) {
        var response = new yak.api.UpdateInstanceResponse(request.id);
        var validator = new yak.api.InstanceValidator(request.instance);

        if (validator.isValid()) {
            // Name has changed so remove instance with old name
            if (request.instanceId !== request.instance.id) {
                yakServer.instanceManager.removeInstance(request.instanceId);
            }

            yakServer.instanceManager.addOrUpdateInstance(request.instance);
        } else {
            response.success = false;
            response.message = validator.getMessage();
        }

        return response;
    };
};
