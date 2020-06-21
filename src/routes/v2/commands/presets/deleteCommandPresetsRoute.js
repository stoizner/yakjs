'use strict';

const {commandPresetsProvider} = require('../../../../service');
const HttpStatus = require('http-status-codes');

/**
 * @param request
 * @param response
 */
function deleteCommandPresetsRoute(request, response) {
    /**
     * @type {string}
     */
    const presetName = request.params.presetName;

    if (commandPresetsProvider.exists(presetName)) {
        commandPresetsProvider.deletePreset(presetName);
        response.send();
    } else {
        response.status(HttpStatus.BAD_REQUEST).send({
            message: 'Preset does not exist.'
        });
    }
}

module.exports = deleteCommandPresetsRoute;
