'use strict';

const state = require('../../../../yakServerState');
const HttpStatus = require('http-status-codes');
const commandDispatcher = require('../../../../command/commandDispatcher');

/**
 * @param request
 * @param response
 */
function executeCommandPresetRoute(request, response) {
    /**
     * @type {string}
     */
    const presetName = request.params.presetName;

    let preset = state.commandPresetsProvider.exists(presetName) ? state.commandPresetsProvider.getPreset(presetName) : null;

    if (presetName && preset && preset.commandName) {
        commandDispatcher
            .execute(preset.commandName, preset.commandData)
            .then(returnValues => response.send(returnValues))
            .catch(error => response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({message: error}));
    } else {
        response.status(HttpStatus.BAD_REQUEST).send({
            message: 'Preset does not exist.',
            presetName: presetName
        });
    }
}

module.exports = executeCommandPresetRoute;
