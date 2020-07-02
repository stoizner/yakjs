'use strict';

import pkg from '../../../../package.json';

/**
 * @param request
 * @param response
 */
export function getStatusRoute(request, response) {
    const statusInfo = {
        isOnline: true,
        version: pkg.version
    };

    response.send(statusInfo);
}
