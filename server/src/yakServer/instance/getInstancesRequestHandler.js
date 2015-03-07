/**
 * GetInstancesRequestHandler
 * @constructor
 * @param {yak.YakServer} yakServer
 * @implements {yak.RequestHandler}
 */
yak.GetInstancesRequestHandler = function GetInstancesRequestHandler(yakServer) {
    'use strict';

    /**
     * @param {yak.api.GetInstancesRequest} request
     * @returns {yak.api.GetInstancesResponse} response
     */
    this.handle = function handle(request) {
        var entities = yakServer.instanceManager.getInstanceEntities();
        var response = new yak.api.GetInstancesResponse(request.id);

        _.each(entities, _.partial(addToResponseAsInstanceInfo, response));

        return response;
    };

    /**
     * @param {yak.api.GetInstancesResponse} response
     * @param {yak.InstanceEntity} entity
     */
    function addToResponseAsInstanceInfo(response, entity) {
        var instanceInfo = new yak.api.InstanceInfo();
        instanceInfo.id = entity.id;
        instanceInfo.name = entity.name;
        instanceInfo.connectionCount = entity.getConnections().length;
        instanceInfo.pluginTotalCount = entity.plugins.length;
        instanceInfo.pluginActiveCount = entity.activePluginCount;
        instanceInfo.port = entity.port;
        instanceInfo.state = entity.state;
        instanceInfo.plugins = entity.plugins;
        instanceInfo.description = entity.description;

        response.instances.push(instanceInfo);
    }
};
