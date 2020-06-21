'use strict';

const pkg = require('../../../../package.json');

/**
 * @param request
 * @param response
 */
function getStatusRoute(request, response) {
    const statusInfo = {
        isOnline: true,
        version: pkg.version
    };

    response.send(statusInfo);
}

module.exports = {getStatusRoute};
