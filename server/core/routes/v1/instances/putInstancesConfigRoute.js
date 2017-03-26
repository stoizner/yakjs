'use strict';

const state = require('../../../yakServerState');
const InstanceConfigValidator = require('../../../instanceConfig/instanceConfigValidator');

/**
 * @param request
 * @param response
 */
function putInstancesConfigRoute(request, response)  {
    const instanceId = request.params.instanceId;
    let responseData = {};

    const requestInstanceConfig = request.body.instanceConfig;
    let validator = new InstanceConfigValidator(requestInstanceConfig);

    if (validator.isValid()) {
        let instanceConfig = state.instanceConfigProvider.getConfig(instanceId);

        if (instanceConfig) {
            Object.assign(instanceConfig, requestInstanceConfig);

            // Name has changed so remove instance with old name
            if (instanceId !== requestInstanceConfig.id) {
                state.instanceManager.stopAndRemoveInstance(instanceId);
                state.instanceConfigProvider.remove(instanceId);
            }

            state.instanceConfigProvider.addOrUpdate(instanceConfig);
            state.instanceManager.createInstance(instanceConfig.id);

            response.send(responseData);
        } else {
            responseData.message = 'No instance configuration available for ' + instanceId;
            response.status(400).send(responseData);
        }
    } else {
        responseData.message = validator.getMessage();
        response.status(400).send(responseData);
    }
}

module.exports = putInstancesConfigRoute;
