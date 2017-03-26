'use strict';

const state = require('../../../yakServerState');

/**
 * @param request
 * @param response
 */
function postClearModulesCacheRoute(request, response)  {
    state.moduleProvider.clearModuleCache();
    response.send();
}

module.exports = postClearModulesCacheRoute;
