'use strict';

const state = require('../../../../yakServerState');
const HttpStatus = require('http-status-codes');

/**
 * @param request
 * @param response
 */
function postCommandPresetsRoute(request, response) {
    /**
     * @type {!CommandPreset}
     */
    const preset = request.body.preset;

    if (preset && preset.name) {
        state.commandPresetsProvider.createOrUpdate(preset);
        response.send();
    } else {
        response.status(HttpStatus.BAD_REQUEST).send({
            message: 'No preset or preset.name missing.'
        });
    }
}

module.exports = postCommandPresetsRoute;
