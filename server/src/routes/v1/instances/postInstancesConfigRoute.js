'use strict';

const state = require('../../../yakServerState');
const InstanceConfig = require('../../../instanceConfig/instanceConfig');
const InstanceConfigValidator = require('../../../instanceConfig/instanceConfigValidator');
const HttpStatus = require('http-status-codes');

/**
 * @param request
 * @param response
 */
function postInstancesConfigRoute(request, response) {
    let requestInstanceConfig = request.body.instanceConfig;
    let instanceConfig = Object.assign(new InstanceConfig(), requestInstanceConfig);
    let validator = new InstanceConfigValidator(instanceConfig);

    if (validator.isValid()) {
        state.instanceConfigProvider.addOrUpdate(instanceConfig);
        state.instanceManager.createInstance(requestInstanceConfig.id);
        response.send();
    } else {
        response.status(HttpStatus.BAD_REQUEST).send({
            message: validator.getMessage()
        });
    }
}

module.exports = postInstancesConfigRoute;
