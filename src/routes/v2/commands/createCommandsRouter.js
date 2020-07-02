'use strict';

import express from 'express';
import getCommandExecuteRoute from './getCommandExecuteRoute.js';
import getCommandsRoute from './getCommandsRoute.js';
import postCommandExecuteRoute from './postCommandExecuteRoute.js';

/**
 * @param {Service} service
 */
export function createCommandsRouter(service) {
    const router = express.Router(); // eslint-disable-line new-cap

    const routes = [
        getCommandsRoute,
        getCommandExecuteRoute,
        postCommandExecuteRoute
    ];

    routes.forEach(route => router[route.method](route.path, route.handler));

    return router;
}
