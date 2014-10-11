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
    * @param {yak.api.UpdateInstanceRequest} message
    * @param {yak.WebSocketConnection} connection
    */
    this.handle = function handle(message, connection) {
        try {
            // Name has changed so remove instance with old name
            if (message.instanceId !== message.instance.id) {
                yakServer.instanceManager.removeInstance(message.instanceId);
            }

            yakServer.instanceManager.addOrUpdateInstance(message.instance);

            connection.send(new yak.api.UpdateInstanceResponse());

        } catch (ex) {
            yakServer.serviceInstance.log.error(ex.message);
        }
    };
};
