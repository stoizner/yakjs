/**
 * @constructor
 * @param {yak.InstanceConfigProvider} instanceConfigProvider
 * @param {yak.InstanceManager} instanceManager
 */
yak.DeleteInstanceConfigRequestHandler = function DeleteInstanceConfigRequestHandler(instanceConfigProvider, instanceManager) {
    'use strict';

    /**
     * @param {yak.api.DeleteInstanceConfigRequest} request
     * @returns {yak.api.DeleteInstanceConfigResponse} response
     */
    this.handle = function handle(request) {
        instanceManager.stopAndRemoveInstance(request.instanceId);
        instanceConfigProvider.remove(request.instanceId);

        return new yak.api.DeleteInstanceConfigResponse(request.id);
    };
};
