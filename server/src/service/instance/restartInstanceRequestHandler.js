/**
 * RestartInstanceRequestHandler
 * @constructor
 * @param {yak.YakServer} yakServer
 * @implements {yak.ServiceMessageHandler}
 */
yak.RestartInstanceRequestHandler = function RestartInstanceRequestHandler(yakServer) {
    'use strict';

    /**
     * @type {yak.RestartInstanceRequestHandler}
     */
    var self = this;

    /**
     * @param {yak.api.StartInstanceRequest} request
     * @param {yak.WebSocketConnection} connection
     */
    this.handle = function handle(request, connection) {
        try {
            yakServer.instanceManager.stop(request.instanceName);
            yakServer.instanceManager.start(request.instanceName);
            connection.send(new yak.api.RestartInstanceResponse());
        } catch (ex) {
            yakServer.serviceInstance.log.error(ex.message);
        }
    };
};
