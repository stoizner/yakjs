'use strict';

const state = require('../../../yakServerState');

/**
 * @param request
 * @param response
 */
function deleteModulesRoute(request, response)  {
    /**
     * @type {string}
     */
    const moduleName = request.params.moduleName;

    if (state.moduleProvider.exists(moduleName)) {
        state.moduleProvider.deleteModule(moduleName);
        response.send();
    } else {
        response.status(400).send({
            message: 'Module does not exist.'
        });
    }
}

module.exports = deleteModulesRoute;
