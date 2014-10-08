/**
 * GetInstancesRequestHandler
 * @constructor
 * @param {yak.YakServer} yakServer
 * @implements {yak.ServiceMessageHandler}
 */
yak.GetInstancesRequestHandler = function GetInstancesRequestHandler(yakServer) {
    'use strict';

    /**
     * @type {yak.StartInstanceRequestHandler}
     */
    var self = this;

    /**
    * @param {yak.WebSocketMessage} message
    * @param {yak.WebSocketConnection} connection
    */
    this.handle = function handle(message, connection) {
        try {
            var entities = yakServer.instanceManager.getInstanceEntities();
            var response = new yak.api.GetInstancesResponse();

            _.each(entities, function convert(entity) {
                var instanceInfo = new yak.api.InstanceInfo();
                instanceInfo.name = entity.name;
                instanceInfo.connectionCount = entity.getConnections().length;
                instanceInfo.pluginTotalCount = entity.plugins.length;
                instanceInfo.pluginActiveCount = entity.activePluginCount;
                instanceInfo.port = entity.port;
                instanceInfo.state = entity.state;
                instanceInfo.plugins = entity.plugins;
                instanceInfo.description = entity.description;

                response.instances.push(instanceInfo);
            });

            connection.send(response);
        } catch (ex) {
            yakServer.serviceInstance.log.error(ex.message);
        }
    };
};
