'use strict';

const express = require('express');
const getCommandExecuteRoute = require('./getCommandExecuteRoute');
const getCommandsRoute = require('./getCommandsRoute');
const postCommandExecuteRoute = require('./postCommandExecuteRoute');

/**
 * @param {Service} service
 */
function createCommandsRouter(service) {
    const router = express.Router(); // eslint-disable-line new-cap

    const routes = [
        getCommandsRoute,
        getCommandExecuteRoute,
        postCommandExecuteRoute
    ];

    routes.forEach(route => router[route.method](route.path, route.handler));

    return router;
}

module.exports = {createCommandsRouter};
