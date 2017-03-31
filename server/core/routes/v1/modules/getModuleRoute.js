'use strict';

const state = require('../../../yakServerState');

/**
 * @param request
 * @param response
 */
function getModuleRoute(request, response) {
    /**
     * @type {string}
     */
    const moduleName = request.params.moduleName;

    response.send({
        module: state.moduleProvider.getModule(moduleName)
    });
}

module.exports = getModuleRoute;
