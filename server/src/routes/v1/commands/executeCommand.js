'use strict';

const HttpStatus = require('http-status-codes');
const commandDispatcher = require('../../../command/commandDispatcher');

/**
 * @param request
 * @param response
 */
function executeCommandRoute(request, response) {
    /**
     * @type {!FileContainer}
     */
    const data = request.body;

    /**
     * @type {string}
     */
    const commandName = request.params.commandName;

    commandDispatcher
        .execute(commandName, data)
        .then(returnValues => response.send(returnValues))
        .catch(error => response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({message: error}));
}

module.exports = executeCommandRoute;
