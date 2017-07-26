'use strict';

const logProvider = require('../../../infrastructure/logProvider');
const HttpStatus = require('http-status-codes');

/**
 * @param request
 * @param response
 */
function getPluginLogs(request, response) {
    /**
     * @type {string}
     */
    const requestedPluginId = request.params.pluginId;

    logProvider.getPluginLogs(requestedPluginId)
        .then(data => {
            response.header('Content-Type', 'text/plain');
            response.send(data);
        })
        .catch(error => {
            response.status(HttpStatus.BAD_REQUEST).send({error: error});
        });
}

module.exports = getPluginLogs;
