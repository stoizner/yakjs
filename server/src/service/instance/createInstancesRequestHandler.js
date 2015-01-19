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
    * @param {yak.api.CreateInstanceRequest} message
    * @param {yak.WebSocketConnection} connection
    */
    this.handle = function handle(message, connection) {
        try {
           var newInstance = _.clone(message.instance);

            yakServer.instanceManager.addInstance(newInstance);

            connection.send(new yak.api.CreateInstanceResponse());
        } catch (ex) {
            yakServer.serviceInstance.log.error(ex.message);
        }
    };
};
