/**
 * UpdateInstanceRequestHandler
 * @constructor
 * @param {yak.YakServer} yakServer
 * @implements {yakServiceMessageHandler}
 */
yak.UpdateInstanceRequestHandler = function UpdateInstanceRequestHandler(yakServer) {
    'use strict';

    /**
     * @type {yak.UpdateInstanceRequestHandler}
     */
    var self = this;

    /**
    * @param {yak.api.UpdateInstanceRequest} request
    * @param {yak.WebSocketConnection} connection
    */
    this.handle = function handle(request, connection) {
        try {
            // Name has changed so remove instance with old name
            if (request.instanceId !== request.instance.id) {
                yakServer.instanceManager.removeInstance(request.instanceId);
            }

            yakServer.instanceManager.addOrUpdateInstance(request.instance);

            connection.send(new yak.api.UpdateInstanceResponse(request.id));

        } catch (ex) {
            yakServer.serviceInstance.log.error(ex.message);
        }
    };
};
