'use strict';

const path = require('path');
const fsAdapter = require('../../../adapter/fsAdapter');

const serverConfig = require('../../../../config.json');
const HttpStatus = require('http-status-codes');

/**
 * @param request
 * @param response
 * @returns {!Promise}
 */
function putServerConfigRoute(request, response) {
    let promise;

    /**
     * @type {Object} A partial {Config} object.
     */
    const newServerConfig = request.body.serverConfig;

    if (newServerConfig) {
        Object.keys(serverConfig).forEach(key => {
            if (newServerConfig.hasOwnProperty(key)) {
                serverConfig[key] = newServerConfig[key];
            }
        });

        promise = fsAdapter
            .writeJsonFile(path.join(__dirname, '../../../../config.json'), serverConfig)
            .then(() => response.send());
    } else {
        promise = response.status(HttpStatus.BAD_REQUEST).send({
            message: 'The request body does not contain a JSON object with a serverConfig property.'
        });
    }

    return promise;
}

module.exports = putServerConfigRoute;
