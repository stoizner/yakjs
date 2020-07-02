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

    commandDispatcher
        .execute(commandName)
        .then(returnValues => response.send(returnValues))
        .catch(error => response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({message: error}));
}
