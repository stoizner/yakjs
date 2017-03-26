'use strict';

const state = require('../../../yakServerState');
const PluginParser = require('../../../plugin/pluginParser');
const PluginValidator = require('../../../plugin/pluginValidator');

/**
 * @param request
 * @param response
 */
function putModulesRoute(request, response)  {
    /**
     * @type {string}
     */
    const moduleName = request.params.moduleName;

    /**
     * @type {!Module}
     */
    const module = request.body.module;

    if (module && module.name && moduleName) {
        state.moduleProvider.createOrUpdate(module.name, module.content);

        // When the name changes, delete the old module.
        if (moduleName !== module.name) {
            state.moduleProvider.deleteModule(moduleName);
        }

        response.send();
    } else {
        response.status(400).send({
            message: 'No module or module.name missing.'
        });
    }
}

module.exports = putModulesRoute;
