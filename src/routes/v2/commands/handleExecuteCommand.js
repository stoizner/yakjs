'use strict';

import HttpStatus from 'http-status-codes';

/**
 * @param request
 * @param response
 */
export function handleExecuteCommand(request, response) {
    const commandDispatcher = request.app.locals.service.commandDispatcher;

    /**
     * @type {string}
     */
    const commandName = request.params.commandName;

    const body = request.body;
    let commandData = null;

    if (typeof body === 'object') {
        commandData = body;
    } else if (typeof body === 'string') {
        try {
            commandData = JSON.parse(body);
        } catch(error) {
            commandData = body || null;
        }
    }

    commandDispatcher
        .execute(commandName, commandData)
        .then(returnValues => response.send(returnValues))
        .catch(error => response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({message: error}));
}
