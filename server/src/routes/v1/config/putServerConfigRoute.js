'use strict';

const configProvider = require('../../../config/configProvider');
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

    const serverConfig = Object.assign({}, configProvider.config);

    if (newServerConfig) {
        Object.keys(serverConfig).forEach(key => {
            if (newServerConfig.hasOwnProperty(key)) {
                serverConfig[key] = newServerConfig[key];
            }
        });

        promise = configProvider
            .update(serverConfig)
            .then(() => response.send());
    } else {
        promise = response.status(HttpStatus.BAD_REQUEST).send({
            message: 'The request body does not contain a JSON object with a serverConfig property.'
        });
    }

    return promise;
}

module.exports = putServerConfigRoute;
