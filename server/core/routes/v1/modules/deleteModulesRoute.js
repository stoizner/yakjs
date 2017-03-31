'use strict';

const state = require('../../../yakServerState');
const HttpStatus = require('http-status-codes');

/**
 * @param request
 * @param response
 */
function deleteModulesRoute(request, response) {
    /**
     * @type {string}
     */
    const moduleName = request.params.moduleName;

    if (state.moduleProvider.exists(moduleName)) {
        state.moduleProvider.deleteModule(moduleName);
        response.send();
    } else {
        response.status(HttpStatus.BAD_REQUEST).send({
            message: 'Module does not exist.'
        });
    }
}

module.exports = deleteModulesRoute;
