/**
 * DeleteInstanceRequestHandler
 * @constructor
 * @param {yak.YakServer} yakServer
 * @implements {yakServiceMessageHandler}
 */
yak.DeleteInstanceRequestHandler = function DeleteInstanceRequestHandler(yakServer) {
    'use strict';

    /**
     * @type {yak.DeleteInstanceRequestHandler}
     */
    var self = this;

    /**
    * @param {yak.api.DeleteInstanceRequest} request
    * @param {yak.WebSocketConnection} connection
    */
    this.handle = function handle(request, connection) {
        try {
            yakServer.instanceManager.removeInstance(request.instanceId);
            connection.send(new yak.api.DeleteInstanceResponse(request.id));
        } catch (ex) {
            yakServer.serviceInstance.log.error(ex.message);
        }
    };
};
