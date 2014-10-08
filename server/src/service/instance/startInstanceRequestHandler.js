/**
 * StartInstanceRequestHandler
 * @constructor
 * @param {yak.YakServer} yakServer
 * @implements {yak.ServiceMessageHandler}
 */
yak.StartInstanceRequestHandler = function StartInstanceRequestHandler(yakServer) {
    'use strict';

    /**
     * @type {yak.StartInstanceRequestHandler}
     */
    var self = this;

    /**
     * @param {yak.api.StartInstanceRequest} request
     * @param {yak.WebSocketConnection} connection
     */
    this.handle = function handle(request, connection) {
        try {
            yakServer.instanceManager.start(request.instanceName);
            connection.send(new yak.api.StartInstanceResponse());
        } catch (ex) {
            yakServer.serviceInstance.log.error(ex.message);
        }
    };
};
