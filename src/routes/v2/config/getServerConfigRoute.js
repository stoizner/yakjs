'use strict';

/**
 * @param request
 * @param response
 */
export function getServerConfigRoute(request, response) {
    const config = request.app.locals.service.config;

    let responseData = {
        serverConfig: config
    };

    response.send(responseData);
}
