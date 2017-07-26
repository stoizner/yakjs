'use strict';

const state = require('../../../../yakServerState');

/**
 * @param request
 * @param response
 */
function getCommandPresetsRoute(request, response) {
    let presets = state.commandPresetsProvider.getAllPresets();

    response.send({presets});
}

module.exports = getCommandPresetsRoute;
