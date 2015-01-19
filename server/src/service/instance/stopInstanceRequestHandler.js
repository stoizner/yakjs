/**
 * StopInstanceRequestHandler
 * @constructor
 * @param {yak.YakServer} yakServer
 * @implements {yakServiceMessageHandler}
 */
yak.StopInstanceRequestHandler = function StopInstanceRequestHandler(yakServer) {
    'use strict';

    /**
     * @type {yak.StartInstanceRequestHandler}
     */
    var self = this;

    /**
    * @param {yak.api.StopInstanceRequest} request
    * @param {yak.WebSocketConnection} connection
    */
    this.handle = function handle(request, connection) {
        try {
            yakServer.instanceManager.stop(request.instanceId);
            connection.send(new yak.api.StopInstanceResponse(request.id));
        } catch (ex) {
            yakServer.serviceInstance.log.error(ex.message);
        }
    };
};
