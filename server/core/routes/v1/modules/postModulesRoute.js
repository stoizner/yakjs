'use strict';

const state = require('../../../yakServerState');

/**
 * @param request
 * @param response
 */
function postModulesRoute(request, response)  {
    /**
     * @type {!Module}
     */
    const module = request.body.module;

    if (module && module.name) {
        state.moduleProvider.createOrUpdate(module.name, module.content);
        response.send();
    } else {
        response.status(400).send({
            message: 'No module or module.name missing.'
        });
    }
}

module.exports = postModulesRoute;
