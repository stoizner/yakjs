'use strict';

const {commandPresetsProvider} = require('../../../../service');

/**
 * @param request
 * @param response
 */
function getCommandPresetsRoute(request, response) {
    let presets = state.commandPresetsProvider.getAllPresets();

    response.send({presets});
}

module.exports = getCommandPresetsRoute;
