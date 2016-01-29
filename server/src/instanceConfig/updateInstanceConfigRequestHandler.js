/**
 * @constructor
 * @param {yak.InstanceConfigProvider} instanceConfigProvider
 * @param {yak.InstanceManager} instanceManager
 */
yak.UpdateInstanceConfigRequestHandler = function UpdateInstanceConfigRequestHandler(instanceConfigProvider, instanceManager) {
    'use strict';

    /**
     * @param {yak.api.UpdateInstanceConfigRequest} request
     * @returns {yak.api.UpdateInstanceConfigResponse} response
     */
    this.handle = function handle(request) {
        var response = new yak.api.UpdateInstanceResponse(request.id);
        var validator = new yak.api.InstanceConfigValidator(request.instance);

        if (validator.isValid()) {
            var instanceConfig = instanceConfigProvider.getConfig(request.instanceId);

            if (instanceConfig) {
                Object.assign(instanceConfig, request.instance);

                // Name has changed so remove instance with old name
                if (request.instanceId !== request.instance.id) {
                    instanceManager.stopAndRemoveInstance(request.instanceId);
                    instanceConfigProvider.remove(request.instanceId);
                }

                instanceConfigProvider.addOrUpdate(instanceConfig);
                instanceManager.createInstance(instanceConfig.id);
            } else {
                response.success = false;
                response.message = 'No instance configuration available for ' + request.instanceId;
            }
        } else {
            response.success = false;
            response.message = validator.getMessage();
        }

        return response;
    };
};
