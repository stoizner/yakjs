'use strict';

import express from 'express';
import getInstancesRoute from './getInstancesRoute.js';
import postStartInstancesRoute from './postStartInstancesRoute.js';
import postStopInstancesRoute from './postStopInstancesRoute.js';
import postRestartRunningInstancesRoute from './postRestartRunningInstancesRoute.js';

/**
 * @param {Service} service
 */
export function createInstancesRouter(service) {
    const router = express.Router(); // eslint-disable-line new-cap

    const routes = [
        getInstancesRoute,
        postStartInstancesRoute,
        postStopInstancesRoute,
        postRestartRunningInstancesRoute
    ];

    routes.forEach(route => router[route.method](route.path, route.handler));

    return router;
}
