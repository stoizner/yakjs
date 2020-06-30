'use strict';

const express = require('express');
const getInstancesRoute = require('./getInstancesRoute');
const postStartInstancesRoute = require('./postStartInstancesRoute');
const postStopInstancesRoute = require('./postStopInstancesRoute');
const postRestartRunningInstancesRoute = require('./postRestartRunningInstancesRoute');

/**
 * @param {Service} service
 */
function createInstancesRouter(service) {
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

module.exports = {createInstancesRouter};
