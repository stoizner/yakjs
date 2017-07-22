'use strict';

const state = require('../../../yakServerState');

/**
 * @param request
 * @param response
 */
function getModuleNamesRoute(request, response) {
    let moduleNames = state.moduleProvider.getAllModuleNames();

    response.send({
        moduleNames: moduleNames
    });
}

module.exports = getModuleNamesRoute;
