'use strict';

const config = require('../../../../config');

/**
 * @param request
 * @param response
 */
function getServerConfigRoute(request, response) {
    let responseData = {
        serverConfig: config
    };

    response.send(responseData);
}

module.exports = getServerConfigRoute;
