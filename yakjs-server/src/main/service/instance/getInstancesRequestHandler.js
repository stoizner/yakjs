/**
 * GetInstancesRequestHandler
 * @constructor
 * @param {yak.YakServer} yakServer
 * @implements {yak.ServiceMessageHandler}
 */
yak.GetInstancesRequestHandler = function GetInstancesRequestHandler(yakServer) {

    'use strict';

    /** @type {yak.StartInstanceRequestHandler} */
    var self = this;

    /** Constructor */
    function constructor() {
    }

    /**
    * @param {yak.WebSocketMessage} message
    * @param {yak.WebSocketConnection} connection
    */
    this.handle = function handle(message, connection) {

        try {
            var instances = yakServer.getInstances();
            var response = new yak.api.GetInstancesResponse();

            for(var i=0; i<instances.length; i++) {
                var instance = instances[i];

                var instanceInfo = new yak.api.InstanceInfo();
                instanceInfo.name = instance.name;
                instanceInfo.connectionCount = instance.getConnections().length;
                instanceInfo.pluginTotalCount = instance.plugins.length;
                instanceInfo.pluginActiveCount = instance.activePluginCount;
                instanceInfo.port = instance.port;
                instanceInfo.state = instance.state;
                instanceInfo.plugins = instance.plugins;
                instanceInfo.description = instance.description;

                response.instances.push(instanceInfo);
            }
            connection.send(response);
        } catch (ex) {
            yakServer.serviceInstance.log.error(ex.message);
        }
    };

    constructor();
};