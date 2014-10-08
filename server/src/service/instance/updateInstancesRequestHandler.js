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
            if (message.instanceName !== message.name) {
                yakServer.instanceManager.removeInstance(message.instanceName);
            }

            var instance = new yak.Instance();
            instance.name = message.name;
            instance.port = message.port;
            instance.description = message.description;
            instance.plugins = message.plugins;

            yakServer.instanceManager.addOrUpdateInstance(instance);

            connection.send(new yak.api.UpdateInstanceResponse());

        } catch (ex) {
            yakServer.serviceInstance.log.error(ex.message);
        }
    };
};
