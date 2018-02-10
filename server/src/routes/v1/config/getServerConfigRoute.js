'use strict';

const configProvider = require('../../../config/configProvider');

/**
 * @param request
 * @param response
 */
function getServerConfigRoute(request, response) {
    let responseData = {
        serverConfig: configProvider.config
    };

    response.send(responseData);
}

module.exports = getServerConfigRoute;
