/**
 * CreateInstanceConfigRequestHandler
 * @constructor
 * @param {yak.InstanceConfigProvider} instanceConfigProvider
 * @param {yak.InstanceManager} instanceManager
 */
yak.CreateInstanceConfigRequestHandler = function CreateInstanceConfigRequestHandler(instanceConfigProvider, instanceManager) {
    'use strict';

    /**
     * @param {yak.api.CreateInstanceConfigRequest} request
     * @returns {yak.api.CreateInstanceConfigResponse} response
     */
    this.handle = function handle(request) {
        var instanceConfig = Object.assign(new yak.InstanceConfig(), request.instance);
        var response = new yak.api.CreateInstanceConfigResponse(request.id);
        var validator = new yak.api.InstanceConfigValidator(instanceConfig);

        if (validator.isValid()) {
            instanceConfigProvider.addOrUpdate(instanceConfig);
            instanceManager.createInstance(request.instance.id);
        } else {
            response.success = false;
            response.message = validator.getMessage();
        }

        return response;
    };
};
