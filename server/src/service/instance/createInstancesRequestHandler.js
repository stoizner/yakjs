/**
 * CreateInstanceRequestHandler
 * @constructor
 * @param {yak.YakServer} yakServer
 * @implements {yakServiceMessageHandler}
 */
yak.CreateInstanceRequestHandler = function CreateInstanceRequestHandler(yakServer) {
    'use strict';

    /**
     * @type {yak.CreateInstanceRequestHandler}
     */
    var self = this;

    /**
    * @param {yak.api.CreateInstanceRequest} request
    * @param {yak.WebSocketConnection} connection
    */
    this.handle = function handle(request, connection) {
        try {
           var newInstance = _.clone(request.instance);

            yakServer.instanceManager.addInstance(newInstance);

            connection.send(new yak.api.CreateInstanceResponse(request.id));
        } catch (ex) {
            yakServer.serviceInstance.log.error(ex.message);
        }
    };
};
