'use strict';

const state = require('../../../../yakServerState');
const HttpStatus = require('http-status-codes');

/**
 * @param request
 * @param response
 */
function putCommandPresetsRoute(request, response) {
    /**
     * @type {string}
     */
    const presetName = request.params.presetName;

    /**
     * @type {!CommandPreset}
     */
    const preset = request.body.preset;

    if (preset && preset.name && presetName) {
        state.commandPresetsProvider.createOrUpdate(preset);

        // When the name changes, delete the old preset.
        if (presetName !== preset.name) {
            state.commandPresetsProvider.deletePreset(presetName);
        }

        response.send();
    } else {
        response.status(HttpStatus.BAD_REQUEST).send({
            message: 'No preset or preset.name missing.'
        });
    }
}

module.exports = putCommandPresetsRoute;
